const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  country: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  occupation: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['host', 'player', 'guest'],
    required: false
  },
  token: {
    type: String
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: Date,
    required: false
  }
});

// UserSchema.pre('save', async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next()
//   } catch (error) {
//     next(error)
//   }
// })
UserSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};


module.exports = mongoose.model('User', UserSchema);
