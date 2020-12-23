const bcrypt = require("bcrypt");
const User = require('../models/user.model');


async function insert(user) {
  return await new User(user).save();
}

async function findById(id) {
  return await User.findById(id);
}

async function findByEmail(user) {
  let email = user;
  return User.findOne({email: email});
}

async function updateToken(id, token) {
  return await User.findByIdAndUpdate({_id: id}, {
    token: token
  }, {new: true});
}

async function resetPasswordToken(id, token) {
  return await User.findByIdAndUpdate({_id: id}, {
    resetPasswordToken: token
  }, {new: true});
}

async function updateUser(user, id) {
  return await User.findByIdAndUpdate(id, {
    "firstName": user.firstName,
    "lastName": user.lastName,
    "country": user.country,
    "city": user.city,
    "occupation": user.occupation
  }, {new: true})
}

async function updatePassword(user, id) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;

  return await User.findByIdAndUpdate(id, {
    "password": user.password,
  }, {new: true})
}


async function resetPassword(token, password) {

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  password = hashedPassword;
  return User.findOneAndUpdate({resetPasswordToken: token}, {
    password: password
  }, {new: true})
}

async function oldPassword(Password) {
  console.log(Password);
  let password = Password
  return User.findOne({password: password});
}

module.exports = {
  insert, findByEmail, updateToken, updateUser, resetPassword, resetPasswordToken, findById, updatePassword, oldPassword
}
