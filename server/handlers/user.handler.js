const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const MailService = require("../services/mail.service");
const {hashPassword} = require('../Utils/index');
const bcrypt = require("bcrypt");
const {messages} = require("../Utils/constants");


const UserHandler = {
  signup: async (req, res) => {
    let email = await UserService.findByFields({email: req.body.email});
    if (email) {
      return res.json({message: messages.EMAIL_EXIST});
    }
    req.body.password = await hashPassword(req.body.password);
    let user = await UserService.create(req.body)
    if (!user) {
      return res.status(401).json({message: messages.REGISTRATION_FAILED});
    }
    return res.json({message: messages.REGISTRATION_SUCCESS});
  },
  login: async (req, res) => {
    let user = await UserService.findByFields({email: req.body.email});
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
    let update = await UserService.update(id, {token});
    if (!update) {
      return res.status(401).json({message: messages.UPDATE_FAILED});
    }
    update = update.toObject();
    delete update.password;
    res.json(update);
  },
  updateProfile: async (req, res) => {
    let user = await UserService.update(req.user.id, req.body);
    if (!user) {
      res.status(401).json({message: messages.UPDATE_FAILED});
    }
    res.json({message: messages.UPDATE_SUCCESS});
  },
  forgotPassword: async (req, res) => {
    let user = await UserService.findByFields({email: req.body.email});
    if (!user) {
      res.status(401).json({message: messages.USER_NOT_EXIST});
    }
    const payLoad = {email: user.email, id: user._id};
    const secret = process.env.JWT_SECRET;
    const resetToken = jwt.sign(payLoad, secret);
    let update = await UserService.update(user._id, {
      resetPasswordToken: resetToken
    });
    let mailOptions = {
      from: 'usamaijazksr@gmail.com',
      to: user.email,
      subject: 'Reset your Password',
      text: 'That was easy!',
      html: 'http://' + req.headers.host + '/hostresetpassword/'
    };
    MailService().send(mailOptions);
    res.json({
      resetToken: update.resetPasswordToken
    });
  },
  resetPassword: async (req, res) => {
    req.body.password = await hashPassword(req.body.password);
    let user = await UserService.updateWithFilter({
      resetPasswordToken: req.body.resetPasswordToken
    }, {password: req.body.password});
    if (!user) {
      return res.status(401).json({message: messages.PASSWORD_UPDATE_FAILED});
    }
    res.json({message: messages.PASSWORD_UPDATE_SUCCESS});
  },
  getProfile: async (req, res) => {
    let user = await UserService.findById(req.body.userId, [
      'firstName', 'lastName', 'country', 'city', 'occupation'
    ]);
    if (!user) {
      return res.status(401).json({message: messages.USER_NOT_EXIST});
    }
    res.json(user);
  },
  guestLogin: async (req, res) => {
    let user = await UserService.create(req.body);
    if (!user) {
      return res.status(401).json({message: messages.LOGIN_FAILED});
    }
    res.json(user);
  },
  updatePassword: async (req, res) => {
    let user = await UserService.findById(req.user.id);
    if (!user) {
      return res.status(401).json({message: messages.USER_NOT_EXIST});
    }
    let result = await bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!result) {
      return res.status(401).json({message: messages.CURRENT_PASSWORD_FAILED});
    }
    req.body.newPassword = await hashPassword(req.body.newPassword);
    let update = await UserService.update(req.user.id, {
      password: req.body.newPassword
    });
    if (!update) {
      return res.status(401).json({message: messages.PASSWORD_UPDATE_FAILED});
    }
    res.json({message: messages.PASSWORD_UPDATE_SUCCESS});
  },
  searchPlayer: async (req, res) => {
    let player = await UserService.findPlayers(req.body.playerName);
    if (player.length == 0) {
      return res.status(401).json({message: messages.SEARCH_PLAYER_FAILED});
    }
    res.json(player);
  },
  logout: async (req, res) => {
    let user = await UserService.findById(req.body.userId);
    if (!user) {
      return res.status(401).json({message: messages.USER_NOT_EXIST});
    }
    let updateUser = await UserService.update(req.body.userId, {token: ''});
    if (!updateUser) {
      return res.status(401).json({message: messages.LOGOUT_FAILED});
    }
    res.json({message: messages.LOGOUT_SUCCESS});
  }
}


module.exports = UserHandler;
