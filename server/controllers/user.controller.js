const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  insert, findForLogin, addToken
}

async function insert(user) {
  return  await new User(user).save();
}

async function findForLogin(user) {
  let email =user;
return  User.findOne({email: email});
}
async function addToken(id, token) {
  return   User.findByIdAndUpdate({_id: id}, {
    token: token
  }, {new: true});

}
