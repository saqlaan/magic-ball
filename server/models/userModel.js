const mongoose = require('mongoose');

const SUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true,
  },

});


module.exports = mongoose.model('SUser', SUserSchema);
