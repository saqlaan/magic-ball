const mongoose = require('mongoose'), Schema = mongoose.Schema;
const mongodb = require('mongodb');
const {Player} = require('../models/player.model');
const {v4: uuidv4} = require('uuid');
const {customAlphabet} = require('nanoid');
const nanoid = customAlphabet('1234567890abcdef', 4);
const {User} = require('../models/user.model')
const Round = require('../models/round.model')
const GameSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  gameCode: {
    type: String,
    default: () => nanoid()
  },
  rounds: [Round],
  access_toolbox: {
    type: Boolean,
    required: false,
  },
  save_metrics: {
    type: Boolean,
    required: false,
  },
  noOfRounds:{
    type: String,
    required: false,
  },
  players: [{
    type: Schema.ObjectId,
    ref: 'User',
    minItems: 0,
    maxItems: 5
  }],
  ballsPerRound: {
    type: Number,
    required: false,
  },
  totalScore: {
    type: Number,
    required: false
  },

  timePerSecond: {
    type: Number,
    required: false
  },

  maxPlayers: {
    type: Number,
    required: false
  },
  currentRound: {
    type: Number,
    required: false
  },
});

module.exports = mongoose.model('Game', GameSchema);
