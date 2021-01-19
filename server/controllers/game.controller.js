const Game = require('../models/game.model');
const mongoose = require('mongoose')


async function insert(game) {
  return await new Game(game).save();
}

async function findGameByCode(gameCode) {
  return Game.findOne({gameCode: gameCode});
}

async function addUserInGame(player, gameCode) {
  return Game.findOneAndUpdate({gameCode: gameCode}, {
    $push: {players: player}
  }, {new: true});
}

async function findGameById(id, rounds) {
  return await Game.findById(id);
}

async function updateGameStart(id, rounds) {
  return Game.findOneAndUpdate({_id: id}, {
    "currentRound": 1,
    $push: {rounds: rounds}
  }, {new: true});
}
async function addRound(id, rounds, currentRound) {
  return Game.findOneAndUpdate({_id: id}, {
    "currentRound": currentRound,
    $push: {rounds: rounds}
  }, {new: true});
}

async function endRound(gameId,totalScore, {status, roundsId}) {
  return Game.findOneAndUpdate(
    {_id: gameId, 'rounds._id': roundsId},
    {
      totalScore: totalScore,
      $set: {
        'rounds.$.status': status
      }
    }, {
      new: true
    }
  );

}
async function endGame(gameId,{completed}) {
  return Game.findOneAndUpdate(
    {_id: gameId},
    {
      completed: completed
    }, {
      new: true
    }
  );

}


async function updatePlan(arrangement, gameId, roundsId, roundsTime) {
  console.log(arrangement)
  console.log(roundsId);
  return Game.findOneAndUpdate(
    {_id: gameId, 'rounds._id': roundsId},
    {
      $set: {
        'rounds.$.arrangement': arrangement,
        'rounds.$.stepEndingTime': roundsTime
      }
    }, {
      new: true
    }
  );

}
async function updateStepEndingTime(gameId, roundsId, roundsTime) {
  return Game.findOneAndUpdate(
    {_id: gameId, 'rounds._id': roundsId},
    {
      $set: {
        'rounds.$.stepEndingTime': roundsTime
      }
    }, {
      new: true
    }
  );

}

async function updateArch(gameId, archWizard, round, roundsId,timeKeeper,scoreKeeper) {
  return Game.findOneAndUpdate(
    {_id: gameId, 'rounds._id': roundsId},
    {
      archWizard: archWizard,
      timeKeeper: timeKeeper,
      scoreKeeper: scoreKeeper,
      $set: {
        'rounds.$.ballsEstimate': round.ballsEstimate
      }
    }, {
      new: true
    }
  );
}

async function addReady(gameId, roundId, {batchFlow, ballsArrangement, greenPlayers, redPlayers, currentBallHolder}) {
  return Game.findOneAndUpdate(
    {_id: gameId, 'rounds._id': roundId},
    {
      $set: {
        'rounds.$.ballsArrangement': ballsArrangement,
        'rounds.$.batchFlow': batchFlow,
        'rounds.$.greenPlayers': greenPlayers,
        'rounds.$.redPlayers': redPlayers,
        'rounds.$.currentBallHolder': currentBallHolder,
        'rounds.$.ballsMade': 0,
        'rounds.$.wastedBalls': 0,
        'rounds.$.status': 'playing',
      }
    }, {
      new: true
    }
  );
}


async  function ballMovement(gameId, {roundId,redList, greenList, currentBallHolder, movedList, status, ballsMade, ballsWasted} ){
  return Game.findOneAndUpdate(
    {_id: gameId, 'rounds._id': roundId},
    {
      $set: {
        'rounds.$.greenPlayers': greenList,
        'rounds.$.redPlayers': redList,
        'rounds.$.currentBallHolder': currentBallHolder,
        'rounds.$.moved': movedList,
        'rounds.$.status': status,
        'rounds.$.ballsMade': ballsMade,
        'rounds.$.ballsWasted': ballsWasted,

      }
    }, {
      new: true
    }
  );
}

module.exports = {
  insert, addUserInGame, findGameByCode, findGameById, updateGameStart,
  updatePlan, updateArch, addReady,addRound,updateStepEndingTime,ballMovement,endRound,endGame
}
