const mongoose = require('mongoose');
const {Delegate} = require('../models/delegate.model');
const {User} = require('./user.model')
const ballMovement = require('./ballMovementModel')
const Position = require('./position.model')
const RoundSchema = new mongoose.Schema({
    status: {
      type: String,
      enum: ['plan', 'estimate', 'ready', 'planning', 'end', 'playing', 'halt'],
      required: false,
      default: 'plan'
    },
    ballsEstimate: {
      type: Number,
      required: true,
      default: 0
    },
    batchFlow: {
      type: Number,
      required: true,
      default: 1
    },
    ballsArrangement: [[{
      type: Number,
      required: true,
    }]],
    ballsMade: {
      type: Number,
      required: true,
      default: 0
    },
    stepEndingTime: {
      type: Number,
      required: true,
    },
    wastedBalls: {
      type: Number,
      required: true,
      default: 0
    },
    ballsTouched: {
      type: Boolean,
      required: true,
      default: false
    },
    currentArea: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
      default: 3
    },
    ballMovement: {},
    arrangement: [{
      _id: false,
      id:{
        type: mongoose.Schema.ObjectId, ref: 'User'
      },
      incrementalId: Number,
      position: Position,
    }],
  greenPlayers: [{
    type: String,
    required: false,
  }],
  redPlayers: [{
    type: String,
    required: false,
  }],
  moved: [{
    type: String,
    required: false,
  }],
  currentBallHolder: {
      type:String,
      required:false
  },
  unAcceptable: {
      type:Boolean,
  }
  })
;


module.exports = RoundSchema;
