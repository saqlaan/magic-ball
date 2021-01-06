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
      // const found = code.players.includes(req.body.playerId);
      let found = false
      for (let index = 0; index < code.players.length; index++) {
        console.log(code.players[index].id);
        console.log(req.body.playerId);
        if (code.players[index].id === req.body.playerId) {
          console.log(index);
          found = true;
          break;
        }
      }
      console.log(found)
      if (found === false) {
        player = {
          id: req.body.playerId,
          incrementalId: code.players.length + 1
        }
        if (code.players.length < code.maxPlayers && found === false) {
          let game = await gameCtrl.addUserInGame(player, req.body.gameCode);
          if (game) {
            let result = game.players.map(x => (x.id));
            result.pop(req.body.playerId)
            socket.sendMessage([result, game.hostId], {method: 'playerAdded', data: null});
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
    let date = new Date();
    let time = date.getTime() + 120000;
    console.log(time)
    let round = {
      status: "plan",
      ballsEstimate: 0,
      batchFlow: 0,
      BallsArrangement: [[]],
      ballsMade: 0,
      ballStatus: 0,
      wastedBall: 0,
      stepEndingTime: time
    }
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let startGame = await gameCtrl.updateGameStart(game._id, round);
      if (startGame) {
        let result = startGame.players.map(x => (x.id));
        socket.sendMessage([result, startGame.hostId], {method: 'planStarted', data: null});
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
      let date = new Date();
      let time = date.getTime() + 120000;
      let currentRound = game.currentRound - 1;
      let round = {
        ballsEstimate: req.body.balls,
        stepEndingTime: time
      }
      const roundsId = game.rounds[currentRound]._id;

      let updateGame = await gameCtrl.updateArch(req.body.gameId, req.body.archWizard, round, roundsId);
      if (updateGame) {
        let result = updateGame.players.map(x => (x.id));
        socket.sendMessage([result, updateGame.hostId], {method: 'estimateAdded', data: null});
        res.json(updateGame);
      } else {
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
  console.log(req.body.arrangement.length)
  if (errors.length === 0) {
    if (req.body.arrangement.length !== 0) {
      console.log("if");
      let game = await gameCtrl.findGameById(req.body.gameId);
      if (game) {
        let date = new Date();
        let time = date.getTime() + 120000;
        let currentRound = game.currentRound - 1;
        let roundTime = time;

        const roundsId = game.rounds[currentRound]._id;
        let arrangement = req.body.arrangement.map(x => (x.inc_id));
        let updateGame = await gameCtrl.updatePlan(arrangement, req.body.gameId, roundsId, roundTime);

        if (updateGame) {
          let result = updateGame.players.map(x => (x.id));
          socket.sendMessage([result, updateGame.hostId], {method: 'planAdded', data: null});
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
      console.log("else")
      debugger
      let game = await gameCtrl.findGameById(req.body.gameId);
      if (game) {
        let date = new Date();
        let time = date.getTime() + 120000;
        let currentRound = game.currentRound - 1;
        let roundTime = time;
        const roundsId = game.rounds[currentRound]._id;
        let updateGame = await gameCtrl.updateStepEndingTime(req.body.gameId, roundsId, roundTime);
        if (updateGame) {
          let result = updateGame.players.map(x => (x.id));
          socket.sendMessage([result, updateGame.hostId], {method: 'planAdded', data: null});
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

    }
  } else {
    res.status(404).json(errors)
  }
}

async function addReady(req, res) {
  let errors = [];
  // if (req.body.batchNumber === undefined || req.body.batchNumber === '') {
  //   errors.push("batchNumber is required");
  // }
  if (req.body.ballsArrangement === undefined || req.body.ballsArrangement === '') {
    errors.push("ballsArrangement is required");
  }
  if (req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }

  if (errors.length === 0) {
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      if (game.currentRound !== 1) {
        console.log("if");

        let currentRound = game.currentRound - 1;
        let round = {
          ballsArrangement: req.body.ballsArrangement,
          batchFlow: req.body.batchNumber
        }
        const roundsId = game.rounds[currentRound]._id;

        let updateGame = await gameCtrl.addReady(req.body.gameId, round, roundsId);
        if (updateGame) {
          let result = updateGame.players.map(x => ({id: x.id}));
          socket.sendMessage([result, updateGame.hostId], {method: 'readyadded', data: null});
          res.json(updateGame);
        } else {
          res.status(404).json(
            {message: 'game is not updated'}
          )
        }
      } else {
        console.log("else")
        let currentRound = game.currentRound - 1;
        let round = {
          ballsArrangement: req.body.ballsArrangement,
        }
        const roundsId = game.rounds[currentRound]._id;

        let updateGame = await gameCtrl.addArrangement(req.body.gameId, round, roundsId);
        if (updateGame) {
          let result = updateGame.players.map(x => ({id: x.id}));
          socket.sendMessage([result, updateGame.hostId], {method: 'readyadded', data: null});
          res.json(updateGame);
        } else {
          res.status(404).json(
            {message: 'game is not updated'}
          )
        }
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
  gameSettings, joinGame, getGameByCode, startGame, addEstimate, addPlan, addReady
}
