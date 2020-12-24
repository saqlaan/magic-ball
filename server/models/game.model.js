const mongoose = require('mongoose'), Schema = mongoose.Schema;
const mongodb = require('mongodb');
const {Player} = require('../models/player.model');
const {v4: uuidv4} = require('uuid');
const {customAlphabet} = require('nanoid');
const nanoid = customAlphabet('1234567890abcdef', 4);

const GameSchema = new mongoose.Schema({
  gameCode: {
    type: String,
    default: () => nanoid()
  },
  groupName: {
    type: String,
    required: true,
    unique: true
  },
  players: [{
    type: Schema.ObjectId,
    ref: Player,
    unique: true
  }],
  groupSize: {
    type: Number,
    required: true,
  },
  rounds: {
  type: Number,
    required: true,
  },
  balls: {
  type: Number,
    required: true,
  },
  status: {
  type: Boolean,
    required: true,
 },


});

module.exports = mongoose.model('Game', GameSchema);
