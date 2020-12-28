const mongoose = require('mongoose'), Schema = mongoose.Schema;
const mongodb = require('mongodb');

const DelegateSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  delegateName: {
    type: String,
    required: true,
  },
});

module.exports = DelegateSchema;
