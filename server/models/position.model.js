const mongoose = require('mongoose');
const PositionSchema = new mongoose.Schema({
    _id:false,
    x:{type: Number, default: 0},
    y:{type: Number, default: 0},
  })
module.exports = PositionSchema;
