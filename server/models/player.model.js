const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true
  },

});


module.exports = mongoose.model('Player', PlayerSchema);
