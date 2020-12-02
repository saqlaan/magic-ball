const express = require('express');
const asyncHandler = require('express-async-handler')
const userCtrl = require('../controllers/Suser.controller');

const router = express.Router();
module.exports = router;

router.post('/signup',asyncHandler(signup) );



async function signup(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}

