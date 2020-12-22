const express = require('express');
const asyncHandler = require('express-async-handler')
const gameCtrl = require('../controllers/game.controller');
const router = express.Router();
module.exports = router;
const GameHandler = require('../handlers/game.handler')


router.post('/addgame', asyncHandler(addgame));
router.post('/searchgame/', asyncHandler(searchgame));
router.post('/game-settings', asyncHandler(GameHandler.gameSettings));
router.post('/add-player', asyncHandler(GameHandler.addPlayer));


async function addgame(req, res) {
  let game = await gameCtrl.insert(req.body);
  res.json(game);
}

async function searchgame(req, res) {
  let game = await gameCtrl.addUserInGame(req.body);
  return res.json(game);
}

