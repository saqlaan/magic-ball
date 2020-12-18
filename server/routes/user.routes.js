const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const UserHandler = require('../handlers/user.handler');
const {verifyToken} = require("../middleware/index.middleware");

router.post('/signup', asyncHandler(UserHandler.signup));
router.post('/login', asyncHandler(UserHandler.login));
router.post('/forgot-password', asyncHandler(UserHandler.forgotPassword));
router.post('/reset-password', asyncHandler(UserHandler.resetPassword));
router.put('/update-profile', verifyToken, asyncHandler(UserHandler.updateProfile));

module.exports = router;
