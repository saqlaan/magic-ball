const {filterListWithList, isNeighbour} = require("../Utils");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");
const socket = require('../socket');
const Round = require('../models/round.model')

async function addGame(req, res) {
  let game = await gameCtrl.insert(req.body);
  res.json(game);
}

async function searchGame(req, res) {
  let game = await gameCtrl.addUserInGame(req.body);
  return res.json(game);
}

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
      const obj = game.toObject();
      if(game.currentRound > 0){
        let currentRound = obj.rounds[obj.currentRound - 1];
        currentRound['playersWithStatus'] = []
        currentRound.arrangement.forEach((arrangement,index) => {
          let playerObj = {
            ...arrangement,
            status: '',
            archWizard: '',
            currentBallHolder: ''
          };
          if(currentRound.greenPlayers.includes(arrangement.id.toString())) {
            playerObj['status'] = 'green';
          }else if(currentRound.redPlayers.includes(arrangement.id.toString())) {
            playerObj['status'] = 'red';
          }
          if(game.archWizard != undefined){
            if(game.archWizard.toString() == arrangement.id.toString()){
              playerObj['archWizard'] = true;
            }else{
              playerObj['archWizard'] = false;
            }
          }
          if(currentRound.currentBallHolder != undefined){
            if(currentRound.currentBallHolder.toString() == arrangement.id.toString()){
              playerObj['currentBallHolder'] = true;
            }else{
              playerObj['currentBallHolder'] = false;
            }
          }
          currentRound['playersWithStatus'].push(playerObj);
        })
      }
      res.json(obj);
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
        if (code.players[index].id === req.body.playerId) {
          found = true;
          break;
        }
      }
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
            socket.sendMessage([...result, game.hostId], {method: 'playerAdded', data: null});
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
  if(req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if(errors.length === 0) {
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
    if(game) {
      let startGame = await gameCtrl.updateGameStart(game._id, round);
      if(startGame) {
        let result = startGame.players.map(x => (x.id));
        socket.sendMessage([...result, startGame.hostId], {method: 'planStarted', data: null});
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
  if(req.body.gameId === undefined || req.body.gameId === '') {
    res.status(400).json({
      message: "GameId is required",
    })
  }
  let game = await gameCtrl.findGameById(req.body.gameId);
  if(game) {
    if(game.currentRound === 1) {
      let time =new Date().getTime() + 120000;
      let currentRound = game.currentRound - 1;
      let round = {
        ballsEstimate: req.body.balls,
        stepEndingTime: time
      }
      const roundsId = game.rounds[currentRound]._id;

      let updateGame = await gameCtrl.updateArch(req.body.gameId, req.body.archWizard, round, roundsId);
      if(updateGame) {
        let result = updateGame.players.map(x => (x.id));
        socket.sendMessage([...result, updateGame.hostId], {method: 'estimateAdded', data: null});
        res.json(updateGame);
      } else {
        res.status(404).json({
          message: "Game is not updated"
        })
      }
    } else {
      if(req.body.balls === undefined || req.body.balls === '') {
        errors.push("balls is required");
      }
      if(req.body.archWizard === undefined || req.body.archWizard === '') {
        errors.push("archWizard is required");
      }
      if(errors.length === 0) {
        let time = new Date().getTime() + 120000;
        let currentRound = game.currentRound - 1;
        let round = {
          ballsEstimate: req.body.balls,
          stepEndingTime: time
        }
        const roundsId = game.rounds[currentRound]._id;

        let updateGame = await gameCtrl.updateRoundArch(req.body.gameId, round, roundsId);
        if(updateGame) {
          let result = updateGame.players.map(x => (x.id));
          socket.sendMessage([...result, updateGame.hostId], {method: 'estimateAdded', data: null});
          res.json(updateGame);
        } else {
          res.status(404).json({
            message: "Game is not updated"
          })
        }
      } else {
        res.status(400).json(errors)
      }
    }
  } else {
    res.status(400).json({
      message: "Game Not Found"
    })
  }
}

async function addPlan(req, res) {
  let errors = [];
  if(req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if(req.body.arrangement === undefined || req.body.arrangement === '') {
    errors.push("arrangement is required");
  }
  if(errors.length === 0) {
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let roundEndingTime = new Date().getTime() + 120000;
      let currentRound = game.currentRound - 1;
      const roundsId = game.rounds[currentRound]._id;
      let updatedGame;
      if (req.body.arrangement.length !== 0) {
        updatedGame = await gameCtrl.updatePlan(req.body.arrangement, req.body.gameId, roundsId, roundEndingTime);
      } else {
        updatedGame = await gameCtrl.updatePlan(game.players, req.body.gameId, roundsId, roundEndingTime);
      }
      if (updatedGame) {
        let result = updatedGame.players.map(x => (x.id));
        socket.sendMessage([...result, updatedGame.hostId], {method: 'planAdded', data: null});
        res.json(updatedGame);
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
}

async function addReady(req, res) {
  let errors = [];
  if(req.body.gameId === undefined || req.body.gameId === '') {
    res.status(400).json({
      message: "GameId is required",
    })
  }
  let game = await gameCtrl.findGameById(req.body.gameId);
  if(game) {
    if(game.currentRound === 1) {
      const {greenList, redList, currentBallHolder} = getPlayerNextBallMovement(game, game.archWizard);
      let updatedGame = await gameCtrl.addReady(game._id, game.rounds[game.currentRound - 1]._id,
        {
          batchFlow: 1,
          ballsArrangement: null,
          greenPlayers: greenList,
          redPlayers: redList,
          currentBallHolder: currentBallHolder
        });
      if(updatedGame){
        socket.sendMessage([...game.players.map(player => player.id), game.hostId], {method: 'readyAdded', data: null});
        socket.sendMessage([updatedGame.rounds[updatedGame.currentRound - 1].currentBallHolder], {
          method: 'ballReceived',
          data: null
        });
        socket.sendMessage([updatedGame.hostId], {method: 'ballMoved', data: null});
        res.send(updatedGame);
      }else{
        res.status(400).send({
          message: "Error! Game not updated",
        })
      }
    }else{
      if(req.body.ballsArrangement === undefined || req.body.ballsArrangement === '') {
        errors.push("Balls arrangement is required");
      }
      if(req.body.batchFlow === undefined || req.body.batchFlow === '') {
        errors.push("Batch number is required");
      }
      if(errors.length === 0) {
        const {greenList, redList, currentBallHolder} = getPlayerNextBallMovement(game, game.archWizard);

        let updatedGame = await gameCtrl.addReady(game._id, game.rounds[game.currentRound - 1]._id,
          {
            batchFlow: req.body.batchFlow,
            ballsArrangement: req.body.ballsArrangement,
            greenPlayers: greenList,
            redPlayers: redList,
            currentBallHolder: currentBallHolder
          });
        if(updatedGame) {
          socket.sendMessage([...updatedGame.players.map(player => player.id), updatedGame.hostId], {
            method: 'readyAdded',
            data: null
          });
          res.send(updatedGame);
        } else {
          res.status(400).json({
            message: "Error! Game not updated",
          })
        }
      } else {
        res.status(400).json(errors);
      }
    }
  } else {
    res.status(404).json({
      message: "Game not found",
    })
  }
}


async function moveBall(req, res) {
  let errors = [];

  if(req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if(req.body.playerId === undefined || req.body.playerId === '') {
    errors.push("playerId is required");
  }
  if(errors.length === 0) {
    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      const {greenList, redList, currentBallHolder, movedList, status, ballsMade, ballsWasted} = getPlayerNextBallMovement(game, req.body.playerId);
      let updatedGame = await gameCtrl.ballMovement(game._id, {
        roundId: game.rounds[game.currentRound - 1]._id,
        currentBallHolder, movedList, redList, greenList, ballsMade, ballsWasted, status
      })
      if(updatedGame) {
        socket.sendMessage([currentBallHolder], {
          method: 'ballReceived',
          data: null
        });
        socket.sendMessage([updatedGame.hostId], {
          method: 'ballMoved',
          data: null
        });
        res.json(updatedGame);
      } else {
        res.status(404).json({
          message: "ballMovement",
        })
      }
    } else {
      res.status(404).json({
        message: "Game not found"
      })
    }
  } else {
    res.status(404).json(errors);
  }
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

  if(game.rounds[game.currentRound - 1].currentBallHolder != undefined){
    if(currentBallHolder.toString() === game.archWizard.toString()){
      movedList = [];
      ballsMade +=game.rounds[game.currentRound - 1].batchFlow;
    }else {
      if(!movedList.includes(game.rounds[game.currentRound - 1].currentBallHolder.toString())){
        movedList.push(game.rounds[game.currentRound - 1].currentBallHolder);
      }
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
  greenList = filterListWithList(players, [...redList,currentBallHolder]);
  return {redList, greenList, currentBallHolder, movedList, status: 'playing', ballsMade, ballsWasted};
}

async function startRound(req, res) {
  let errors = [];
  if(req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if(errors.length === 0) {
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
    if(game) {
      let startGame = await gameCtrl.addRound(game._id, round, game.currentRound + 1);
      if(startGame) {
        let result = startGame.players.map(x => (x.id));
        socket.sendMessage([...result, startGame.hostId], {method: 'roundStarted', data: null});
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


async function endRound(req, res) {
  let errors = [];
  if(req.body.gameId === undefined || req.body.gameId === '') {
    errors.push("gameId is required");
  }
  if(errors.length === 0) {

    let game = await gameCtrl.findGameById(req.body.gameId);
    if (game) {
      let totalScore = game.rounds[game.currentRound - 1].ballsMade + game.totalScore;
      let endRound = await gameCtrl.endRound(game._id, totalScore, {
        status: "finish", roundsId: game.rounds[game.currentRound - 1]._id
      });
      if(endRound) {
        let result = endRound.players.map(x => (x.id));
        socket.sendMessage([...result, endRound.hostId], {method: 'roundEnded', data: null});
        res.json(endRound);
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


module.exports = {
  addGame,
  searchGame,
  gameSettings,
  joinGame,
  getGameByCode,
  startGame,
  addEstimate,
  addPlan,
  addReady,
  moveBall,
  startRound,
  endRound
}
