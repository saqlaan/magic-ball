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
async function findGameById(id){
  console.log(id)
  return await Game.findByIdAndUpdate(id, {
    "currentRound": 4,
  }, {new: true})
}

module.exports = {
  insert, addUserInGame, findGameByCode,findGameById
}
