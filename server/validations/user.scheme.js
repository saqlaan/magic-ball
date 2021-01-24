const Joi = require('joi');
const UserScheme = {
  signup: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    occupation: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().required()
  })
}

module.exports = UserScheme;
