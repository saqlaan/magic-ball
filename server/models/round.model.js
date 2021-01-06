const mongoose = require('mongoose');
const {Delegate} = require('../models/delegate.model');

const ballMovement = require('./ballMovementModel')

const RoundSchema = new mongoose.Schema({
    status: {
      type: String,
      enum: ['plan', 'estimate', 'ready', 'planning', 'end'],
      required: false
    },
    ballsEstimate: {
      type: Number,
      required: true,
    },
    batchFlow: {
      type: Number,
      required: true,
    },
    ballsArrangement: [[{
      type: Number,
      required: true,
    }]],
    ballsMade: {
      type: Number,
      required: true,
    },
    stepEndingTime: {
      type: Number,
      required: true,
    },
    ballStatus: {
      type: Number,
      required: true,
    },
    wastedBalls: {
      type: Number,
      required: true,
    },
    ballsTouched: {
      type: Boolean,
      required: true,
    },
    currentArea: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    ballMovement: {},
    arrangement: [{
      type: Number
    }],

  })
;


module.exports = RoundSchema;
