const Game = require('../models/game.model');
const mongoose = require('mongoose')

module.exports = {
  insert,find,update
}

async function insert(game) {
  return await new Game(game).save();
}
async function find(code) {
  return await  Game.find({gameCode:  code});
}
async function update(code, player_id) {
     return await Game.where('gameCode', code).update({"$set": {"players": player_id}});
}
