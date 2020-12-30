const express = require('express');
const asyncHandler = require('express-async-handler')
const gameCtrl = require('../controllers/game.controller');
const router = express.Router();
module.exports = router;
const GameHandler = require('../handlers/game.handler')
const {verifyToken} = require("../middleware/index.middleware");

router.post('/addgame', asyncHandler(addgame));
router.post('/searchgame/', asyncHandler(searchgame));
router.post('/game-settings', verifyToken, asyncHandler(GameHandler.gameSettings));
router.get('/get-game/:gameCode',  asyncHandler(GameHandler.getGameByCode));
router.post('/join-game', asyncHandler(GameHandler.joinGame));
router.put('/start-game', asyncHandler(GameHandler.startGame));


async function addgame(req, res) {
  let game = await gameCtrl.insert(req.body);
  res.json(game);
}

async function searchgame(req, res) {
  let game = await gameCtrl.addUserInGame(req.body);
  return res.json(game);
}

