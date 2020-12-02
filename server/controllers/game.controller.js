const Game = require('../models/game.model');
const mongoose = require('mongoose')

module.exports = {
  insert,find
}

async function insert() {
  return await new Game().save();
}
async function find(id) {
  return await  Game.findById(id);
}
