const {filterListWithList, isNeighbour} = require("../Utils");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");
const socket = require('../socket');
const Round = require('../models/round.model')
const {messages} = require("../Utils/constants");

async function addGame(req, res) {
  let game = await gameCtrl.insert(req.body);
  res.json(game);
}

async function searchGame(req, res) {
  let game = await gameCtrl.addUserInGame(req.body);
  return res.json(game);
}

async function gameSettings(req, res) {
  req.body.hostId = req.user.id;
  if (req.body.players.length <= req.body.maxPlayers) {
    let game = await gameCtrl.insert(req.body);
    if (!game) {
      return res.status(401).json({message: messages.GAME_NOT_EXIST});
    }
    res.status(200).json(game);
  } else {
    res.status(404).json({message: "players are full"});
  }

}

async function getGameByCode(req, res) {
  let game = await gameCtrl.findGameByCode(req.params.gameCode);
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
}

async function joinGame(req, res) {
  let code = await gameCtrl.findGameByCode(req.body.gameCode);
  if (!code) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  let result = code.players.map(x => (x.id));
  let playerIndex = result.indexOf((req.body.playerId));
  if (playerIndex !== -1) {
    return res.status(401).json({message: messages.PLAYER_ALREADY_EXIST});
  }
  let player = {
    id: req.body.playerId,
    incrementalId: code.players.length + 1,
    user: req.body.playerId,
    position: {x: 0, y: 0}
  }
  if (code.players.length > code.maxPlayers) {
    return res.status(401).json({message: messages.PLAYER_SIZE_ERROR});
  }
  let game = await gameCtrl.addUserInGame(player, req.body.gameCode);
  if (!game) {
    return res.status(401).json({message: messages.PLAYER_Add_ERROR});
  }
  let players = game.players.map(x => (x.id));
  players.pop(req.body.playerId);
  socket.sendMessage([...result, game.hostId, ...game.viewers], {method: 'playerAdded', data: null});
  res.json(game);
}

async function startGame(req, res) {
  let time = new Date().getTime() + 120000;
  let round = {
    status: "plan",
    ballsEstimate: 0,
    batchFlow: 1,
    BallsArrangement: null,
    ballsMade: 0,
    ballStatus: 0,
    wastedBall: 0,
    stepEndingTime: time
  }
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  let startGame = await gameCtrl.updateGameStart(game._id, round);
  if (!startGame) {
    return res.status(401).json({message: messages.GAME_START_ERROR});
  }
  let result = startGame.players.map(x => (x.id));
  socket.sendMessage([...result, startGame.hostId, ...startGame.viewers], {method: 'planStarted', data: null});
  res.json(startGame);
}

async function addEstimate(req, res) {
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  if (game.currentRound === 1) {
    if (req.body.archWizard === undefined || req.body.archWizard === '') {
      return res.status(400).json({
        message: "archWizard is required"
      })
    }
    if (req.body.ballsEstimate === undefined || req.body.ballsEstimate === '') {
      return res.status(400).json({
        message: "ballsEstimate is required"
      })
    }
    let time = new Date().getTime() + 120000;
    let currentRound = game.currentRound - 1;
    let round = {
      ballsEstimate: req.body.ballsEstimate,
      stepEndingTime: time,
      status: 'ready'
    }
    const roundsId = game.rounds[currentRound]._id;

    let updateGame = await gameCtrl.updateArch(req.body.gameId, req.body.archWizard, round, roundsId, game.timeKeeper, game.scoreKeeper);
    if (!updateGame) {
      return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
    }
    let result = updateGame.players.map(x => (x.id));
    socket.sendMessage([...result, updateGame.hostId, ...updateGame.viewers], {
      method: 'estimateAdded',
      data: null
    });
    res.json(updateGame);
  } else {
    if (req.body.ballsEstimate === undefined || req.body.ballsEstimate === '') {
      return res.status(400).json({
        message: "ballsEstimate is required"
      })
    }
    if (req.body.scoreKeeper === undefined || req.body.scoreKeeper === '') {
      return res.status(400).json({
        message: "scoreKeeper is required"
      })
    }
    if (req.body.timeKeeper === undefined || req.body.timeKeeper === '') {
      return res.status(400).json({
        message: "timeKeeper is required"
      })
    }
    let time = new Date().getTime() + 120000;
    let currentRound = game.currentRound - 1;
    let round = {
      ballsEstimate: req.body.ballsEstimate,
      stepEndingTime: time,
      status: 'ready'
    }
    const roundsId = game.rounds[currentRound]._id;

    let updateGame = await gameCtrl.updateArch(req.body.gameId, game.archWizard, round, roundsId, req.body.timeKeeper, req.body.scoreKeeper);
    if (!updateGame) {
      return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
    }
    let result = updateGame.players.map(x => (x.id));
    socket.sendMessage([...result, updateGame.hostId, ...updateGame.viewers], {
      method: 'estimateAdded',
      data: null
    });
    res.json(updateGame);
  }

}

async function addPlan(req, res) {
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  let roundEndingTime = new Date().getTime() + 120000;
  let currentRound = game.currentRound - 1;
  const roundsId = game.rounds[currentRound]._id;
  let updatedGame;
  if (req.body.arrangement.length !== 0) {
    updatedGame = await gameCtrl.updatePlan(req.body.arrangement, req.body.gameId, roundsId, roundEndingTime);
  } else {
    updatedGame = await gameCtrl.updatePlan(game.players, req.body.gameId, roundsId, roundEndingTime);
  }
  if (!updatedGame) {
    return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
  }
  let result = updatedGame.players.map(x => (x.id));
  socket.sendMessage([...result, updatedGame.hostId, ...updatedGame.viewers], {method: 'planAdded', data: null});
  res.json(updatedGame);
}

async function addReady(req, res) {

  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  if (game.currentRound === 1) {
    const {greenList, redList, currentBallHolder} = getPlayerNextBallMovement(game, game.archWizard);
    let updatedGame = await gameCtrl.addReady(game._id, game.rounds[game.currentRound - 1]._id,
      {
        batchFlow: 1,
        ballsArrangement: null,
        greenPlayers: greenList,
        redPlayers: redList,
        currentBallHolder: currentBallHolder,
        status: 'playing'
      });
    if (!updatedGame) {
      return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
    }
    socket.sendMessage([...game.players.map(player => player.id), game.hostId, ...updatedGame.viewers], {
      method: 'readyAdded',
      data: null
    });
    socket.sendMessage([updatedGame.hostId], {method: 'ballMoved', data: null});
    res.send(updatedGame);
  } else {
    if (req.body.ballsArrangement === undefined || req.body.ballsArrangement === '') {
      return res.status(400).json({
        message: "Balls arrangement is required"
      })
    }
    if (req.body.batchFlow === undefined || req.body.batchFlow === '') {
      return res.status(400).json({
        message: "Batch flow  is required"
      })
    }
      const {greenList, redList, currentBallHolder} = getPlayerNextBallMovement(game, game.archWizard);
      let updatedGame = await gameCtrl.addReady(game._id, game.rounds[game.currentRound - 1]._id,
        {
          batchFlow: req.body.batchFlow,
          ballsArrangement: null,
          greenPlayers: greenList,
          redPlayers: redList,
          currentBallHolder: currentBallHolder,
          status: 'playing'
        });
      if (!updatedGame) {
        return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
      }
      socket.sendMessage([...updatedGame.players.map(player => player.id), updatedGame.hostId, ...updatedGame.viewers], {
        method: 'readyAdded',
        data: null
      });
      socket.sendMessage([updatedGame.hostId], {method: 'ballMoved', data: null});
      res.send(updatedGame);
  }
}


async function moveBall(req, res) {
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  const {greenList, redList, currentBallHolder, movedList, status, ballsMade, ballsWasted} = getPlayerNextBallMovement(game, req.body.playerId);
  let updatedGame = await gameCtrl.ballMovement(game._id, {
    roundId: game.rounds[game.currentRound - 1]._id,
    currentBallHolder, movedList, redList, greenList, ballsMade, ballsWasted, status
  })
  if (!updatedGame) {
    return res.status(401).json({message: messages.GAME_UPDATE_ERROR});
  }
  socket.sendMessage([currentBallHolder], {
    method: 'ballReceived',
    data: null
  });
  socket.sendMessage([updatedGame.hostId, ...updatedGame.viewers], {
    method: 'ballMoved',
    data: null
  });
  res.json(updatedGame);
}

function getPlayerNextBallMovement(game, playerId) {
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

async function startRound(req, res) {
  let time = new Date().getTime() + 120000;
  let round = {
    status: "plan",
    ballsEstimate: 0,
    batchFlow: 1,
    BallsArrangement: null,
    ballsMade: 0,
    ballStatus: 0,
    wastedBall: 0,
    stepEndingTime: time
  }
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  game.currentRound = game.currentRound + 1;
  let startRound = await gameCtrl.addRound(game._id, round, game.currentRound);
  if (!startRound) {
    return res.status(401).json({message: messages.GAME_START_ERROR});
  }
  let result = startRound.players.map(x => (x.id));
  socket.sendMessage([...result, startRound.hostId, ...startRound.viewers], {method: 'roundStarted', data: null});
  res.json(startRound);
}


async function endRound(req, res) {
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  let totalScore = game.rounds[game.currentRound - 1].ballsMade + game.totalScore;
  let endRound = await gameCtrl.endRound(game._id, totalScore, {
    status: "end", roundsId: game.rounds[game.currentRound - 1]._id
  });
  if (!endRound) {
    return res.status(401).json({message: messages.ROUND_END_ERROR});
  }
  let result = endRound.players.map(x => (x.id));
  socket.sendMessage([...result, endRound.hostId, ...endRound.viewers], {method: 'roundEnded', data: null});
  res.json(endRound);
}

async function gameEnd(req, res) {
  let game = await gameCtrl.findGameById(req.body.gameId);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  let gameEnd = await gameCtrl.endGame(game._id, {completed: true});
  if (!gameEnd) {
    return res.status(401).json({message: messages.GAME_END_ERROR});
  }
  let result = gameEnd.players.map(x => (x.id));
  socket.sendMessage([...result, gameEnd.hostId, ...gameEnd.viewers], {method: 'gameEnded', data: null});
  socket.removeUsers([...result]);
  res.json(gameEnd);

}

async function gameViewers(req, res) {
  let gameCode = req.body.viewerId.split(".");
  let game = await gameCtrl.findGameByCode(gameCode);
  if (!game) {
    return res.status(401).json({message: messages.GAME_NOT_EXIST});
  }
  let view = await gameCtrl.addViewers(req.body.viewerId, gameCode);
  res.json(view);
}

module.exports = {
  gameSettings,
  joinGame,
  getGameByCode,
  startGame,
  addEstimate,
  addPlan,
  addReady,
  moveBall,
  startRound,
  endRound,
  gameEnd,
  gameViewers
}
