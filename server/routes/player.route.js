const express = require('express');
const asyncHandler = require('express-async-handler')
const playerCtrl = require('../controllers/player.controller');
const router = express.Router();
module.exports = router;


router.post('/addplayer',asyncHandler(addplayer) );


async function addplayer(req,res){
  let player = await playerCtrl.insert(req.body);
  res.json(player);
}
