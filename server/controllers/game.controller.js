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

module.exports = {
  insert, addUserInGame, findGameByCode,findGameById,updateGameStart
}
