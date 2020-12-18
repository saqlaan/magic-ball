const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require("../controllers/auth.controller");


async function signup(req, res) {

  let errors = [];
  if (req.body.firstName === undefined || req.body.firstName === null) {
    errors.push("firstName is required");
  }
  if (req.body.lastName === undefined || req.body.lastName === null) {
    errors.push("lastName is required");
  }
  if (req.body.email === undefined || req.body.email === null) {
    errors.push("email is required");
  }
  if (req.body.country === undefined || req.body.country === null) {
    errors.push("country is required");
  }
  if (req.body.city === undefined || req.body.city === null) {
    errors.push("city is required");
  }
  if (req.body.occupation === undefined || req.body.occupation === null) {
    errors.push("occupation is required");
  }
  if (req.body.password === undefined || req.body.password === null) {
    errors.push("password is required");
  }
  if (req.body.type === undefined || req.body.type === null) {
    errors.push("type is required");
  }
  if (errors.length === 0) {
    let user = await userCtrl.insert(req.body);
    if (user) {
      res.json({
        message: "you are registered"
      });
    } else {
      res.status(400).json({
        message: "not registered successfully"
      });
    }
  } else {
    res.status(400).json({
      errors
    })
  }
}

async function login(req, res) {
  let errors = [];

  if (req.body.email === undefined || req.body.email === null) {
    errors.push("email is required");
  }

  if (req.body.password === undefined || req.body.password === null) {
    errors.push("password is required");
  }


  if (errors.length === 0) {
    let user = await userCtrl.findByEmail(req.body.email);
    if (user) {
      bcrypt.compare(req.body.password, user.password, async function (err, result) {
        if (result) {
          const payLoad = {email: user.email, firstName: user.firstName, id: user._id};
          const token = jwt.sign(payLoad, process.env.JWT_SECRET);
          let update = await userCtrl.updateToken(user._id, token);
          update = update.toObject();
          delete update.password;
          res.json(update);
        } else {
          res.status(400).json({
            message: 'passsword not correct',
          })
        }
      })
    } else {
      res.status(404).json({
        message: "email not exist"
      })
    }
  } else {
    res.status(404).json(errors);
  }
}


async function updateProfile(req, res) {

  let errors = [];

  if (req.body.firstName === undefined || req.body.firstName === null) {
    errors.push("firstName is required");
  }
  if (req.body.lastName === undefined || req.body.lastName === null) {
    errors.push("lastName is required");
  }
  if (req.body.country === undefined || req.body.country === null) {
    errors.push("country is required");
  }

  if (req.body.city === undefined || req.body.city === null) {
    errors.push("city is required");
  }

  if (req.body.occupation === undefined || req.body.occupation === null) {
    errors.push("occupation is required");
  }

  if (errors.length === 0) {

    let user = await userCtrl.updateUser(req.body, req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: ' User not found'
      })
    }
  } else {
    res.status(404).json({
      errors
    })
  }
}

async function forgotPassword(req, res) {
  let errors = [];
  if (req.body.email === undefined || req.body.email === null) {
    errors.push("email is required");
  }

  if (errors.length === 0) {
    let user = await userCtrl.findByEmail(req.body.email);
    if (user) {
      const payLoad = {email: user.email, id: user._id};
      const secret = process.env.JWT_SECRET;
      const resetToken = jwt.sign(payLoad, secret);
      let update = await userCtrl.resetPasswordToken(user._id, resetToken);

      let link = "http://" + req.headers.host + "/api/user/reset/" + update.resetPasswordToken;
      res.json({
        message: "email sended succcessfully",
        update: update.resetPasswordToken
      });
    } else {
      res.json({
        message: "user not found",

      })
    }
  } else {
    res.json({
      errors
    })
  }
}

async function resetPassword(req, res) {
  let errors = [];
  if (req.body.password === undefined || req.body.password === null) {
    errors.push("password is required");
  }
  if (req.body.resetPasswordToken === undefined || req.body.resetPasswordToken === null) {
    errors.push("resetPasswordToken is required");
  }


  if (errors.length === 0) {
    let user = await userCtrl.resetPassword(req.body.resetPasswordToken, req.body.password);
    if (user) {
      res.json({
        message: "user is updated",
      })
    } else {
      res.json({
        message: "user not updated",
      })
    }
  } else {
    res.json({
      errors
    })
  }
}

module.exports = {
  signup, login, updateProfile, forgotPassword, resetPassword
}
