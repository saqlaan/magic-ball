const mongoose = require('mongoose'), Schema = mongoose.Schema;
const mongodb = require('mongodb');
const { Player } = require ('../models/player.model');
const { v4: uuidv4 } = require('uuid');

const GameSchema = new mongoose.Schema({
  gameCode: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  status: {
    type: String,
    required: true,
  },
  players: [{
    type: Schema.ObjectId,
    ref:Player
  }]


});

module.exports = mongoose.model('Game', GameSchema);
