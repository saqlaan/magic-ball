const Joi = require('joi');
const UserScheme = {
  signup: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    occupation: Joi.string().required(),
    password: Joi.string().min(6).required(),
    type: Joi.string().required()
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  updateProfile: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    occupation: Joi.string().required(),
  }),
  forgotPassword: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
  resetPassword: Joi.object().keys({
    password: Joi.string().required(),
    resetPasswordToken: Joi.string().required(),
  }),
  logout: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  getProfile: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  guestLogin: Joi.object().keys({
    email: Joi.string().email().required(),
    organization: Joi.string().required(),
  }),
  updatePassword: Joi.object().keys({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  }),
  searchPlayer: Joi.object().keys({
    playerName: Joi.string().required(),
  }),

}


module.exports = UserScheme;
