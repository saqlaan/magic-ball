const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const {hashPassword} = require('../Utils/index');
const bcrypt = require("bcrypt");
const {messages} = require("../Utils/constants");

async function signup(req, res) {
  let email = await userCtrl.findByEmail(req.body.email);
  if (email) {
    return res.json({message: messages.EMAIL_EXIST});
  }
  req.body.password = await hashPassword(req.body.password)
  let user = await userCtrl.insert(req.body);
  if (!user) {
    return res.status(401).json({message: messages.REGISTRATION_FAILED});
  }
  return res.json({message: messages.REGISTRATION_SUCCESS});
}

async function login(req, res) {
  let user = await userCtrl.findByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({message: messages.USER_NOT_EXIST});
  }
  let result = await bcrypt.compareSync(req.body.password, user.password);
  if (!result) {
    return res.status(404).json({message: messages.PASSWORD_NOT_CORRECT});
  }
  if (user.token) {
    return res.status(401).json({message: messages.LOGIN_FAILED});
  }
  const {email, firstName, lastName, id} = user
  const token = jwt.sign({email, firstName, lastName, id}, process.env.JWT_SECRET);
  let update = await userCtrl.updateToken(user._id, token);
  if (!update) {
    return res.status(401).json({message: messages.UPDATE_FAILED});
  }
  update = update.toObject();
  delete update.password;
  return res.json(update);
}


async function updateProfile(req, res) {
  let user = await userCtrl.updateUser(req.body, req.user.id);
  if (!user) {
    res.status(401).json({message: messages.UPDATE_FAILED});
  }
  res.status(401).json({message: messages.UPDATE_SUCCESS});
}

async function forgotPassword(req, res) {
  let user = await userCtrl.findByEmail(req.body.email);
  if (!user) {
    res.status(401).json({message: messages.USER_NOT_EXIST});
  }
  const payLoad = {email: user.email, id: user._id};
  const secret = process.env.JWT_SECRET;
  const resetToken = jwt.sign(payLoad, secret);
  let update = await userCtrl.resetPasswordToken(user._id, resetToken);

  let link = "http://" + req.headers.host + "/hostresetpassword/";
  let nodemailer = require('nodemailer');
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'usamaijazksr@gmail.com',
      pass: 'usama.0900'
    }
  });

  let mailOptions = {
    from: 'usamaijazksr@gmail.com',
    to: user.email,
    subject: 'Reset your Password',
    text: 'That was easy!',
    html: link
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.json({
    resetToken: update.resetPasswordToken
  });
}

async function resetPassword(req, res) {
  let user = await userCtrl.resetPassword(req.body.resetPasswordToken, req.body.password);
  if (!user) {
    return res.status(401).json({message: messages.PASSWORD_UPDATE_FAILED});
  }
  res.status(401).json({message: messages.PASSWORD_UPDATE_SUCCESS});
}

async function getProfile(req, res) {
  let user = await userCtrl.findById(req.body.userId);
  if (!user) {
    return res.status(401).json({message: messages.USER_NOT_EXIST});
  }
  res.status(200).json({
    "firstName": user.firstName,
    "lastName": user.lastName,
    "country": user.country,
    "city": user.city,
    "occupation": user.occupation
  });
}

async function guestLogin(req, res) {
  let user = await userCtrl.insert(req.body);
  if (!user) {
    return res.status(401).json({message: messages.LOGIN_FAILED});
  }
  res.status(200).json(user);
}


async function updatePassword(req, res) {
  let user = await userCtrl.findById(req.user.id);
  if (!user) {
    return res.status(401).json({message: messages.USER_NOT_EXIST});
  }
  let result = await bcrypt.compareSync(req.body.oldPassword, user.password);
  if (!result) {
    return res.status(401).json({message: messages.CURRENT_PASSWORD_FAILED});
  }
  let update = await userCtrl.updatePassword(req.body.newPassword, req.user.id);
  if (!update) {
    return res.status(401).json({message: messages.PASSWORD_UPDATE_FAILED});
  }
  return res.status(401).json({message: messages.PASSWORD_UPDATE_SUCCESS});

}

async function searchPlayer(req, res) {
  let player = await userCtrl.searchPlayer(req.body.playerName);
  if (player.length == 0) {
    return res.status(401).json({message: messages.SEARCH_PLAYER_FAILED});
  }
  res.status(200).json(player);
}

async function logout(req, res) {
  let user = await userCtrl.findById(req.body.userId);
  if (!user) {
    return res.status(401).json({message: messages.USER_NOT_EXIST});
  }
  let updateUser = await userCtrl.removeToken(req.body.userId);
  if (!updateUser) {
    return res.status(401).json({message: messages.LOGOUT_FAILED});
  }
  return res.status(401).json({message: messages.LOGOUT_SUCCESS});
}


module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
  getProfile,
  guestLogin,
  updatePassword,
  searchPlayer
}
