const userCtrl = require('../controllers/user.controller');
const authCtrl = require("../controllers/auth.controller");
const bcrypt = require("bcrypt");
var passwordHash = require('password-hash');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports = {
  signUpUser, loginUser,editProfile
}

async function signUpUser(req, res) {

  let errors = [];
  if (req.body.firstName === undefined || null) {
    errors.push("firstName is required");
  }
  if (req.body.lastName === undefined || null) {
    errors.push("lastName is required");
  }
  if (req.body.email === undefined || null) {
    errors.push("email is required");
  }
  if (req.body.country === undefined || null) {
    errors.push("country is required");
  }
  if (req.body.city === undefined || null) {
    errors.push("city is required");
  }
  if (req.body.occupation === undefined || null) {
    errors.push("occupation is required");
  }
  if (req.body.password === undefined || null) {
    errors.push("password is required");
  }
  if (req.body.type === undefined || null) {
    errors.push("type is required");
  }
  if (errors.length === 0) {
    let user = await userCtrl.insert(req.body);
    console.log(user);
    res.json(user);
  } else {
    res.status(404).json(errors);
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


  if ( errors.length === 0) {
    let user = await userCtrl.findForLogin(req.body.email);
    console.log("password>>", user.password);
    console.log("req password>>", req.body.password);
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      if (result) {
        const payLoad = {email: user.email, firstName: user.firstName, id: user._id};
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payLoad, secret);

        let update = await userCtrl.addToken(user._id, token);
        update = update.toObject();
        delete update.password;

        res.json(update);
      } else {
        res.status(404).json({
          message: ' User not found',
          errors
        })

      }

    })


  }
  else{
    res.status(404).json(errors);
  }
}


async function editProfile(req, res) {

  let errors = [];

  if (req.body.firstName === undefined || null) {
    errors.push("firstName is required");
  }
  if (req.body.lastName === undefined || null) {
    errors.push("lastName is required");
  }


  if (req.body.email === undefined || null) {
    errors.push("email is required");
  }

  if (req.body.country === undefined || null) {
    errors.push("country is required");
  }

  if (req.body.city === undefined || null) {
    errors.push("city is required");
  }

  if (req.body.occupation === undefined || null) {
    errors.push("occupation is required");
  }

  if (errors.length === 0) {

    let user = await userCtrl.findForEdit(req.body, req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: ' User not found'
      })
    }
  }else{
    res.status(404).json({
      errors
    })
  }
}
