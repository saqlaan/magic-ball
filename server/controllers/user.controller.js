const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const escapeStringRegexp = require('escape-string-regexp');


async function insert(user) {
    return await new User(user).save();
}

async function removeToken(id) {
    return await User.findByIdAndUpdate({_id: id}, {
        token: ''
    }, {new: true});
}

async function findById(id) {
    return await User.findById(id);
}

async function findByEmail(email) {
    return User.findOne({email: email});
}

async function updateToken(id, token) {
    return await User.findByIdAndUpdate({_id: id}, {
        token: token
    }, {new: true});
}

async function resetPasswordToken(id, token) {
    return await User.findByIdAndUpdate({_id: id}, {
        resetPasswordToken: token
    }, {new: true});
}

async function updateUser(user, id) {
    return await User.findByIdAndUpdate(id, {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "country": user.country,
        "city": user.city,
        "occupation": user.occupation
    }, {new: true})
}

async function updatePassword(newPassword, id) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    newPassword = hashedPassword;

    return await User.findByIdAndUpdate(id, {
        "password": newPassword,
    }, {new: true})
}


async function resetPassword(token, password) {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;
    return User.findOneAndUpdate({resetPasswordToken: token}, {
        password: password
    }, {new: true})
}

async function oldPassword(Password) {
    console.log(Password);
    let password = Password
    return User.findOne({password: password});
}

async function searchPlayer(firstName) {
    return User.find({firstName: {$regex: firstName}}, {
        firstName: 1
    });
}

module.exports = {
    insert,
    findByEmail,
    updateToken,
    updateUser,
    resetPassword,
    resetPasswordToken,
    findById,
    updatePassword,
    oldPassword,
    searchPlayer,
    removeToken
}
