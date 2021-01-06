const mongoose = require('mongoose'), Schema = mongoose.Schema;
const mongodb = require('mongodb');

const ballMovementSchema = new mongoose.Schema({
  greenPlayers: [{
    type: Number,
    required: true,
  }],
  RedPlayers: [{
    type: Number,
    required: true,
  }],
  moved: [{
    type: Number,
    required: true,
  }],

});

module.exports = ballMovementSchema;
