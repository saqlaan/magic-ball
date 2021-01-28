const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const UserHandler = require('../handlers/user.handler');
const UserScheme = require('../validations/user.scheme')
const {tokenAuthentication, validation} = require('../middleware');

router.post('/signup',validation(UserScheme.signup), asyncHandler(UserHandler.signup));
router.post('/login',validation(UserScheme.login), asyncHandler(UserHandler.login));
router.post('/logout',tokenAuthentication, validation(UserScheme.logout), asyncHandler(UserHandler.logout));
router.post('/forgot-password',validation(UserScheme.forgotPassword), asyncHandler(UserHandler.forgotPassword));
router.post('/reset-password',validation(UserScheme.resetPassword), asyncHandler(UserHandler.resetPassword));
router.post('/get-profile', validation(UserScheme.getProfile),asyncHandler(UserHandler.getProfile));
router.post('/guest-login', validation(UserScheme.guestLogin), asyncHandler(UserHandler.guestLogin));
router.put('/update-profile', validation(UserScheme.updateProfile), asyncHandler(UserHandler.updateProfile));
router.put('/update-password', tokenAuthentication, validation(UserScheme.updatePassword), asyncHandler(UserHandler.updatePassword));
router.post('/search-player',tokenAuthentication, validation(UserScheme.searchPlayer),asyncHandler(UserHandler.searchPlayer) );
module.exports = router;
