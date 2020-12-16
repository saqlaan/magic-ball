const userCtrl = require('../controllers/user.controller');
const authCtrl = require("../controllers/auth.controller");
const bcrypt = require("bcrypt");
var passwordHash = require('password-hash');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = {
  signUpUser, loginUser
}

async function signUpUser(req, res) {

  let errors = [];
  if (req.body.firstName === undefined || null) {
    errors.push("firstName is required");
    console.log(errors);
  }  if (req.body.lastName === undefined || null) {
    console.log(errors);
    errors.push("lastName is required");
  }  if (req.body.email === undefined || null) {
    errors.push("email is required");
  }  if (req.body.country === undefined || null) {
    errors.push("country is required");
  }  if (req.body.city === undefined || null) {
    errors.push("city is required");
  } if (req.body.occupation === undefined || null) {
    errors.push("occupation is required");
  }  if (req.body.password === undefined || null) {
    errors.push("password is required");
  }  if (req.body.type === undefined || null) {
    errors.push("type is required");
  }
  if (errors.length === 0) {
    let user = await userCtrl.insert(req.body);
    res.json(user);
  } else {
    res.json(errors);
  }

}

async function loginUser(req, res) {
  let errors = [];
  if (req.body.email === undefined || null) {
    errors.push("email is required");
  }
  if (req.body.password === undefined || null) {
    errors.push("password is required");
  }
  let user = await userCtrl.findForLogin(req.body);
  if (user && errors.length === 0) {
    const payLoad = {user: user.email, userPassword: user.password};
    console.log(payLoad);

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payLoad, secret);

    let update = await userCtrl.addToken(user._id, token);
    console.log(update);
    update = update.toObject();
    delete update.password;
    res.json(update);

  } else {
    res.status(404).json({
      message: ' User not found',
      errors
    })

  }

}
