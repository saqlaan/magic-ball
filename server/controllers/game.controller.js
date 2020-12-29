const Game = require('../models/game.model');
const mongoose = require('mongoose')

module.exports = {
  insert, addUserInGame, findGameById
}

async function insert(game) {
  return await new Game(game).save();
}

async function findGameById(gameId) {
    return await Game.findById(gameId);
}

async function addUserInGame(player) {
  return Game.findOneAndUpdate({gameCode: player.gameCode}, {
    $push: {players: player.playerId}
  }, {new: true});
}
