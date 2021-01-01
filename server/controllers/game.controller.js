const Game = require('../models/game.model');
const mongoose = require('mongoose')


async function insert(game) {
  return await new Game(game).save();
}

async function findGameByCode(gameCode) {
  return Game.findOne({gameCode: gameCode});
}

async function addUserInGame(player) {
  return Game.findOneAndUpdate({gameCode: player.gameCode}, {
    $push: {players: player.playerId}
  }, {new: true});
}
async function findGameById(id, rounds){
  return await Game.findById(id);
}
async function updateGameStart(id, rounds){
  return  Game.findOneAndUpdate({_id: id},{
      "currentRound": 1,
    $push: {rounds: rounds }
  }, {new:true});
}
async function updatePlan(players, gameId){
  return Game.findByIdAndUpdate( gameId, {
    players: players
    },{new:true})
}
async function updateArch(gameId, archWizard, round, roundsId){
  return Game.findOneAndUpdate(
    {_id:gameId, 'rounds._id': roundsId},
    {
      archWizard: archWizard,
      $set:{
        'rounds.$.ballsEstimate': round.ballsEstimate
      }
    },{
      new:true
    }
    );
}
async function addReady(gameId,  round,roundsId){
  return Game.findOneAndUpdate(
    {_id:gameId, 'rounds._id': roundsId},
    {
      $set:{
        'rounds.$.ballsArrangement': round.ballsArrangement,
        'rounds.$.batchFlow': round.batchFlow
      }
    },{
      new:true
    }
  );
}
module.exports = {
  insert, addUserInGame, findGameByCode,findGameById,updateGameStart,updatePlan,updateArch,addReady
}
