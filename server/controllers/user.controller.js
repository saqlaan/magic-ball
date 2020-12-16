const User = require('../models/user.model');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  insert, findForLogin, addToken
}

async function insert(user) {
  let password = user.password;
    bcrypt.hash(password, 10, (err, hash) => {
      console.log(hash);
      user.password = hash;
      console.log(user.password);
    });
    console.log(user);
  return await new User(user).save();
}

async function findForLogin(user) {
  let email =user.email;
  let password = user.password;
  return  User.findOne({email: email, password: password});
}
async function addToken(id, token) {

  return  User.findByIdAndUpdate({_id: id}, {
    token: token
  });

}
