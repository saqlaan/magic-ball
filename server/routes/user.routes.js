const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const UserHandler = require('../handlers/user.handler');
const {verifyToken} = require("../middleware/index.middleware");

router.post('/signup', asyncHandler(UserHandler.signup));
router.post('/login', asyncHandler(UserHandler.login));
router.post('/forgot-password', asyncHandler(UserHandler.forgotPassword));
router.post('/reset-password', asyncHandler(UserHandler.resetPassword));
router.post('/get-profile', asyncHandler(UserHandler.getProfile));
router.post('/guest-login', asyncHandler(UserHandler.guestLogin));
router.put('/update-profile', verifyToken, asyncHandler(UserHandler.updateProfile));
router.put('/update-password', verifyToken, asyncHandler(UserHandler.updatePassword));
router.post('/search-player',verifyToken,asyncHandler(UserHandler.searchPlayer) );
module.exports = router;
