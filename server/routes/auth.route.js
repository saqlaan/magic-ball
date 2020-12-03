const express = require('express');
const asyncHandler = require('express-async-handler')
const userCtrl = require('../controllers/Suser.controller');
const gameCtrl = require('../controllers/game.controller');
const router = express.Router();
module.exports = router;

router.post('/signup',asyncHandler(signup) );
router.post('/addgame',asyncHandler(addgame) );
router.get('/getgame/:id',asyncHandler(getgame) );

async function signup(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}
async function addgame(req,res){
  let game = await gameCtrl.insert(req.body);
  res.json(game);
}
async function getgame(req,res){
  let game = await gameCtrl.find(req.params.id);
  res.json(game);
}

