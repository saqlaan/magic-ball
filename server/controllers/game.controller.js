const Game = require('../models/game.model');
const mongoose = require('mongoose')

module.exports = {
  insert,find
}

async function insert(game) {
  return await new Game(game).save();
}
async function find(code) {
  return await  Game.find({gameCode:  code});
}
