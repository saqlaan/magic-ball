const express = require('express');
const asyncHandler = require('express-async-handler')
const router = express.Router();
module.exports = router;
const UserHandler = require('../handlers/user.handler');
const userCtrl = require('../controllers/user.controller');
const passport = require('passport');

router.post('/userSignup',asyncHandler(UserHandler.signUpUser) );
router.post('/userLogin',asyncHandler( UserHandler.loginUser));

