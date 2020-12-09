const SUser = require('../models/userModel');

const Joi = require('joi');

const SuserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

})

module.exports = {
  insert
}

async function insert(user) {
  user = await Joi.validate(user, SuserSchema, { abortEarly: false });
  return await new SUser(user).save();
}
