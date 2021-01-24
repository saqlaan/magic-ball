const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const UserHandler = require('../handlers/user.handler');
const UserScheme = require('../validations/user.scheme')
const {tokenAuthentication, validation} = require('../middleware/index.middleware');

router.post('/signup',[validation(UserScheme.signup)], asyncHandler(UserHandler.signup));
router.post('/login', asyncHandler(UserHandler.login));
router.post('/logout', asyncHandler(UserHandler.logout));
router.post('/forgot-password', asyncHandler(UserHandler.forgotPassword));
router.post('/reset-password', asyncHandler(UserHandler.resetPassword));
router.post('/get-profile', asyncHandler(UserHandler.getProfile));
router.post('/guest-login', asyncHandler(UserHandler.guestLogin));
router.put('/update-profile', [tokenAuthentication], asyncHandler(UserHandler.updateProfile));
router.put('/update-password', [tokenAuthentication], asyncHandler(UserHandler.updatePassword));
router.post('/search-player',[tokenAuthentication],asyncHandler(UserHandler.searchPlayer) );
module.exports = router;
