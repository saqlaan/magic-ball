const Player = require('../models/player.model');
const mongoose = require('mongoose');

module.exports = {
  insert
}

async function insert(player) {
  return await new Player(player).save();
}
