const {filterListWithList, addMinutesToCurrentTime} = require("../Utils");
const socket = require('../socket');
const GameService = require('../services/game.service');
const {messages} = require("../Utils/constants");

const GameHandler = {
  gameSettings: async (req, res) => {
    req.body.hostId = req.user.id;
    if (req.body.players.length >= req.body.maxPlayers) {
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
    if (game.currentRound > 0) {
      let currentRound = obj.rounds[obj.currentRound - 1];
      currentRound['playersWithStatus'] = []
      currentRound.arrangement.forEach((arrangement, index) => {
        let playerObj = {
          ...arrangement,
          status: '',
          archWizard: '',
          currentBallHolder: ''
        };
        if (currentRound.greenPlayers.includes(arrangement.id.toString())) {
          playerObj['status'] = 'green';
        } else if (currentRound.redPlayers.includes(arrangement.id.toString())) {
          playerObj['status'] = 'red';
        }
        if (game.archWizard != undefined) {
          if (game.archWizard.toString() == arrangement.id.toString()) {
            playerObj['archWizard'] = true;
          } else {
            playerObj['archWizard'] = false;
          }
        }
        if (currentRound.currentBallHolder != undefined) {
          if (currentRound.currentBallHolder.toString() == arrangement.id.toString()) {
            playerObj['currentBallHolder'] = true;
          } else {
            playerObj['currentBallHolder'] = false;
          }
        }
        currentRound['playersWithStatus'].push(playerObj);
      })
    }
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
    const {greenList, redList, currentBallHolder, movedList, status, ballsMade, ballsWasted} = getPlayerNextBallMovement(game, req.body.playerId);
    const gameData = {
      round: {
        roundId: game.rounds[game.currentRound - 1]._id,
        roundData: {
          redPlayers: redList,
          greenPlayers: greenList,
          moved: movedList,
          wastedBalls: ballsWasted,
          currentBallHolder, ballsMade
        }
      }
    }
    let updatedGame = await GameService.updateRound(req.body.gameId, gameData);
    if (!updatedGame) {
      return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
    }
    socket.actions.receiveBall([currentBallHolder]);
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
      case 'playing':
        socket.actions.endRound(users);
        break;
      case 'end':
        socket.actions.endGame(users);
      default:
    }
    res.send(updatedGame);
  },
  getPlayerNextBallMovement: async (game, playerId) => {
    let currentBallHolder = playerId;
    let currentBallHolderIndex;
    let redList = [];
    let greenList = [];
    let ballsMade = game.rounds[game.currentRound - 1].ballsMade;
    let ballsWasted = game.rounds[game.currentRound - 1].ballsWasted;
    let players = game.players.map(player => player.id);
    let movedList = game.rounds[game.currentRound - 1].moved;
    if (game.rounds[game.currentRound - 1].currentBallHolder) {
      if (!movedList.includes(game.rounds[game.currentRound - 1].currentBallHolder.toString())) {
        movedList.push(game.rounds[game.currentRound - 1].currentBallHolder);
      }
      if ((currentBallHolder.toString() === game.archWizard.toString()) && (movedList.length === game.players.length)) {
        movedList = [];
        ballsMade += game.rounds[game.currentRound - 1].batchFlow;
      }
    }
    currentBallHolderIndex = players.indexOf((currentBallHolder))
    if (currentBallHolderIndex === 0) {
      redList.push(players[1], players[players.length - 1]);
    } else if (currentBallHolderIndex === players.length - 1) {
      redList.push(players[0], players[players.length - 2]);
    } else {
      redList.push(players[currentBallHolderIndex + 1], players[currentBallHolderIndex - 1]);
    }
    redList = filterListWithList(redList);
    greenList = filterListWithList(players, [...redList, currentBallHolder]);
    return {redList, greenList, currentBallHolder, movedList, status: 'playing', ballsMade, ballsWasted};
  }
}

module.exports = GameHandler;
