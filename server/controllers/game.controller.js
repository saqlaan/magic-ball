const Game = require('../models/game.model');
const mongoose = require('mongoose')

module.exports = {
  insert,addUserInGame
}

async function insert(game) {
  return await new Game(game).save();
}

async function addUserInGame({code, player_id}) {
  return Game.findOneAndUpdate({gameCode: code}, {
    $push: {players: player_id}
  }, {new: true});
}
