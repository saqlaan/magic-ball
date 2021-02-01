const {filterListWithList, addMinutesToCurrentTime} = require("../Utils");
const socket = require('../socket');
const GameService = require('../services/game.service');
const {messages} = require("../Utils/constants");

const GameHandler = {
  gameSettings: async (req, res) => {
    req.body.hostId = req.user.id;
    if (req.body.players.length > req.body.maxPlayers) {
      res.status(401).json({message: "Players are full"});
    }
    let game = await GameService.create(req.body);
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    res.json(game);
  },
  getGameByCode: async (req, res) => {
    let game = await GameService.findByCode(req.params.gameCode);
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    const obj = game.toObject();
    res.json(obj);
  },
  joinGame: async (req, res) => {
    let game = await GameService.findByCode(req.body.gameCode);
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    if (game.players.findIndex(item => item.id == req.body.playerId) > -1) {
      return res.status(401).json({message: messages.PLAYER_ALREADY_EXIST});
    }
    if (game.players.length > game.maxPlayers) {
      return res.status(401).json({message: messages.PLAYER_SIZE_ERROR});
    }
    let player = {
      id: req.body.playerId,
      incrementalId: game.players.length + 1,
      user: req.body.playerId,
      position: {x: 0, y: 0}
    }
    let updatedGame = await GameService.addPlayer(game._id, player)
    if (!updatedGame) {
      return res.status(401).json({message: messages.PLAYER_ADD_ERROR});
    }
    const {players, viewers, hostId} = game;
    socket.actions.addPlayer([...players.map(player => player.id), ...viewers, hostId]);
    res.json(updatedGame);
  },
  startRound: async (req, res) => {
    let game = await GameService.findById(req.body.gameId);
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    let gameData = {
      currentRound: game.currentRound + 1,
      roundData: {
        stepEndingTime: addMinutesToCurrentTime(2),
      }
    }
    let updatedGame = await GameService.addRound(game._id, gameData);
    if (!updatedGame) {
      return res.status(401).json({message: messages.GAME_START_ERROR});
    }
    const {players, viewers, hostId} = updatedGame;
    socket.actions.startRound([...players.map(x => (x.id)), ...viewers, hostId]);
    res.json(updatedGame);
  },
  moveBall: async (req, res) => {
    let game = await GameService.findById(req.body.gameId);
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    const data = GameHandler.getPlayerNextBallMovement(game, req.body.playerId);
    const gameData = {
      round: {
        roundId: game.rounds[game.currentRound - 1]._id,
        roundData: {
          ...data
        }
      }
    }
    console.log(gameData);
    let updatedGame = await GameService.updateRound(req.body.gameId, gameData);
    if (!updatedGame) {
      return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
    }
    socket.actions.receiveBall([data.currentBallHolder]);
    socket.actions.moveBall([updatedGame.hostId, ...updatedGame.viewers])
    res.json(updatedGame);
  },
  addViewer: async (req, res) => {
    let gameCode = req.body.viewerId.split(".");
    let game = await GameService.findByCode(gameCode[0])
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    let view = await GameService.addViewer(gameCode, req.body.viewerId)
    res.json(view);
  },
  updateRoundConfiguration: async (req, res) => {
    let game = await GameService.findById(req.body.gameId)
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    const updatedGame = await GameService.updateRound(req.body.gameId, req.body.gameData);
    if (!updatedGame) {
      res.status(422).send("Error!", updatedGame);
    }
    const {players, viewers} = updatedGame;
    const users = [...players.map(x => (x.id)), ...viewers]
    switch (game.rounds[game.currentRound - 1].status) {
      case 'plan':
        socket.actions.addPlan(users);
        break;
      case 'estimate':
        socket.actions.addEstimate(users);
        break;
      case 'ready':
        socket.actions.addReady(users);
        // setTimeout(()=> socket.actions.receiveBall([updatedGame.archWizard]), 500);
        break;
      case 'playing':
        socket.actions.endRound(users);
        break;
      case 'end':
        socket.actions.endGame(users);
      default:
    }
    res.send(updatedGame);
  },
  getPlayerNextBallMovement: (game, playerId) => {
    let currentBallHolder = playerId;
    let currentBallHolderIndex;
    let redPlayers = [];
    let greenPlayers = [];
    let ballsMade = game.rounds[game.currentRound - 1].ballsMade;
    let wastedBalls = game.rounds[game.currentRound - 1].wastedBalls;
    let players = game.players.map(player => player.id);
    let moved = game.rounds[game.currentRound - 1].moved;
    if (game.rounds[game.currentRound - 1].currentBallHolder) {
      if (!moved.includes(game.rounds[game.currentRound - 1].currentBallHolder.toString())) {
        moved.push(game.rounds[game.currentRound - 1].currentBallHolder);
      }
      if ((currentBallHolder.toString() === game.archWizard.toString()) && (moved.length === game.players.length)) {
        moved = [];
        ballsMade += game.rounds[game.currentRound - 1].batchFlow - wastedBalls;
      }
    }
    currentBallHolderIndex = players.indexOf((currentBallHolder))
    if (currentBallHolderIndex === 0) {
      redPlayers.push(players[1], players[players.length - 1]);
    } else if (currentBallHolderIndex === players.length - 1) {
      redPlayers.push(players[0], players[players.length - 2]);
    } else {
      redPlayers.push(players[currentBallHolderIndex + 1], players[currentBallHolderIndex - 1]);
    }
    redPlayers = filterListWithList(redPlayers);
    greenPlayers = filterListWithList(players, [...redPlayers, currentBallHolder]);
    return {redPlayers, greenPlayers, currentBallHolder, moved, ballsMade, wastedBalls};
  }
}

module.exports = GameHandler;
