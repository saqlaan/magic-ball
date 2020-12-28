const mongoose = require('mongoose');
const {Delegate} = require('../models/delegate.model');

const RoundSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['plan', 'estimate', 'ready', 'planning', 'end'],
    required: false
  },
  ballsEstimate: {
    type:Number,
    required: true,
  },
  batchFlow: {
    type:Number,
    required: true,
  },
  BallsArrangement:[ [{
    type:Number,
    required: true,
  } ]],
  ballsMade: {
    type:Number,
    required: true,
  },
  ballStatus: {
    type:Number,
    required: true,
  },
  wastedBalls: {
    type:Number,
    required: true,
  },

});


module.exports = mongoose.model('Round', RoundSchema);
