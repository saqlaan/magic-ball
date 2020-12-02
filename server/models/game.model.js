const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const GameSchema = new mongoose.Schema({
  gameCode: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },


});

module.exports = mongoose.model('Game', GameSchema);
