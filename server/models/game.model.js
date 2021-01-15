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
  noOfRounds: {
    type: Number,
    required: false,
  },
  archWizard: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  players: [{
    _id: false,
    id: {type: Schema.ObjectId, ref: 'User'},
    incrementalId: {type: String}
}],
  ballsPerRound: {
    type: Number,
    required: false,
  },
  totalScore: {
    type: Number,
    required: false,
    default: 0
  },

  timePerRound: {
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
  },completed: {
  type: Boolean,
    required: false,
    default: false,
},
});

module.exports = mongoose.model('Game', GameSchema);

