const User = require('../models/user.model');

const UserService = {
  create: async (userData) => {
    return new User(userData).save();
  },
  findById: async (id, filterFields =[]) => {
    return User.findById(id).select(filterFields.join(' '));
  },
  findByFields: async (fields) => {
    return User.findOne(fields);
  },
  findPlayers: async (firstName) => {
    return User.find({firstName: {$regex: firstName}}, {
      firstName: 1
    });
  },
  update: async (id, userData) => {
    return User.findByIdAndUpdate(id, userData,{new:true});
  },
  updateWithFilter: async (filters, updateData) => {
    return User.findOneAndUpdate(filters,updateData,{new: true});
  }

}
module.exports = UserService;
