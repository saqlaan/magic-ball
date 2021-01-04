const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");
const socket = require('../socket');
const Round = require('../models/round.model')

async function gameSettings(req, res) {
  let errors = [];
  if (errors.length === 0) {
    req.body.hostId = req.user.id;
    if (req.body.players.length <= req.body.maxPlayers) {
      let game = await gameCtrl.insert(req.body);
      if (game) {
        res.status(200).json(game);
      } else {
        res.status(404).json({
          message: "Game is not added",
        })
      }
    } else {
      res.status(404).json({message: "players are full"});
    }
  } else {
    res.status(404).json(errors);
  }
}

async function getGameByCode(req, res) {
  let errors = [];

  if (req.params.gameCode === undefined || req.params.gameCode === '') {
    errors.push("gameId is required");
  }
  if (errors.length === 0) {
    let game = await gameCtrl.findGameByCode(req.params.gameCode);
    if (game) {
      console.log(socket);
      res.json(game);
    } else {
      res.status(404).json({
        message: 'game not found'
      });
    }

  } else {
    res.status(404).json({
      errors
    });
  }

}

async function joinGame(req, res) {

  let errors = [];
  if (req.body.gameCode === undefined || req.body.gameCode === '') {
    errors.push("gameCode is required");
  }
  if (req.body.playerId === undefined || req.body.playerId === '') {
    errors.push("playerId is required");
  }

  if (errors.length === 0) {
    let code = await gameCtrl.findGameByCode(req.body.gameCode)

    if (code) {
      const found = code.players.includes(req.body.playerId);
      if (found === false) {
        if (code.players.length < code.maxPlayers && found === false) {
          let game = await gameCtrl.addUserInGame(req.body);
          if (game) {
            game.players.pop(req.body.playerId);
            socket.sendMessage([...game.players, game.hostId], {method: 'playerAdded', data: null});
            game.players.push(req.body.playerId);
            return res.json(game);
          } else {
            res.status(404).json({
              message: "User not added",
            })
          }
        } else {
          res.status(404).json({
            message: 'players are full'
          })
        }
      } else {
        res.status(404).json({
          message: 'you are already added'
        })
      }
    } else {
      res.status(404).json({
        message: 'game not found'
      });
    }
  } else {
    res.status(404).json(errors);
  }
}

async function startGame(req, res) {
  let errors = [];
  if (req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if (errors.length === 0) {
    let round = {
      status: "plan",
      ballsEstimate: 0,
      batchFlow: 0,
      BallsArrangement: [[]],
      ballsMade: 0,
      ballStatus: 0,
      wastedBall: 0,
    }
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let startGame = await gameCtrl.updateGameStart(game._id, round);
      if (startGame) {
        socket.sendMessage([...startGame.players, startGame.hostId], {method: 'planStarted', data: null});
        res.json(startGame);
      } else {
        res.status(404).json({
          message: "Game is not Started",
        })
      }
    } else {
      res.status(404).json({
        message: "Game not Found",
      })
    }
  } else {
    res.status(404).json(errors);
  }
}

async function addEstimate(req, res) {
  let errors = [];
  if (req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if (req.body.balls === undefined || req.body.balls === '') {
    errors.push("balls is required");
  }
  if (req.body.archWizard === undefined || req.body.archWizard === '') {
    errors.push("archWizard is required");
  }

  if (errors.length === 0) {
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let currentRound = game.currentRound - 1;
      let round = {
        ballsEstimate: req.body.balls
      }
      const roundsId= game.rounds[currentRound]._id;
        let updateGame = await gameCtrl.updateArch(req.body.gameId, req.body.archWizard, round, roundsId);
        if(updateGame){
          // socket.sendMessage([...updateGame.players, updateGame.hostId], {method: 'estimateAdded', data: null});
          res.json(updateGame);
        }else{
          res.status(404).json({
            message: "Game is not updated"
          })
        }
    } else {
      res.status(404).json({
        message: "Game is not found"
      })
    }
  } else {
    res.status(404).json({
      errors
    })
  }
}

async function addPlan(req, res) {
  let errors = [];
  if (req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if (req.body.arrangement === undefined || req.body.arrangement === '') {
    errors.push("arrangement is required");
  }
  if (errors.length === 0) {
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let updatedPlayers = [];
      if (req.body.arrangement.length === game.players.length) {
        req.body.arrangement.forEach(function (value, index) {
          updatedPlayers[index] = game.players[value - 1];
        });
        let updateGame = await gameCtrl.updatePlan(updatedPlayers, req.body.gameId);
        if (updateGame) {
          socket.sendMessage([...updateGame.players, updateGame.hostId], {method: 'planAdded', data: null});
          res.json(updateGame);
        } else {
          res.status(404).json(
            {message: 'game is not updated'}
          )
        }
      } else {
        res.status(404).json(
          {message: 'the length of players are not correct'}
        )
      }
    } else {
      res.status(404).json({
        message: "Game not Found",
      })
    }
  } else {
    res.status(404).json(errors)
  }
}
async function addReady(req, res){
  let errors = [];
  if (req.body.batchNumber === undefined || req.body.batchNumber === '') {
    errors.push("batchNumber is required");
  }
  if (req.body.ballsArrangement === undefined || req.body.ballsArrangement === '') {
    errors.push("ballsArrangement is required");
  }
  if (req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }

  if (errors.length === 0) {
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let currentRound = game.currentRound - 1;
      let round = {
        ballsArrangement: req.body.ballsArrangement,
        batchFlow: req.body.batchNumber
      }
      const roundsId= game.rounds[currentRound]._id;

      let updateGame = await gameCtrl.addReady(req.body.gameId,  round,roundsId);
      if (updateGame) {
        socket.sendMessage([...updateGame.players, updateGame.hostId], {method: 'readyadded', data: null});
        res.json(updateGame);
      } else {
        res.status(404).json(
          {message: 'game is not updated'}
        )
      }
    } else {
      res.status(404).json({
        message: "Game not Found",
      })
    }
  } else {
    res.status(404).json(errors)
  }

}

module.exports = {
  gameSettings, joinGame, getGameByCode, startGame, addEstimate, addPlan,addReady
}
