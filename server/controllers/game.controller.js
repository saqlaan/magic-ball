const Game = require('../models/game.model');
const mongoose = require('mongoose')

module.exports = {
  insert,find,update,addUserInGame
}

async function insert(game) {
  return await new Game(game).save();
}
async function find(code) {
  return await  Game.find({gameCode:  code});
}
async function update({code, player_id}) {
     return await Game.where('gameCode', code).update({"$set": {"players": player_id}});
}
async function addUserInGame({code, player_id}) {
  return Game.findOneAndUpdate({gameCode: code}, {
    $push: {players: player_id}
  }, {new: true});
}
