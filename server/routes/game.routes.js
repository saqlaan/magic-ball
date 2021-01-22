const express = require('express');
const asyncHandler = require('express-async-handler')
const gameCtrl = require('../controllers/game.controller');
const router = express.Router();
const GameHandler = require('../handlers/game.handler')
const {verifyToken} = require("../middleware/index.middleware");

router.post('/addgame', asyncHandler(GameHandler.addGame));
router.post('/searchgame/', asyncHandler(GameHandler.searchGame));
router.post('/game-settings', verifyToken, asyncHandler(GameHandler.gameSettings));
router.get('/get-game/:gameCode',  asyncHandler(GameHandler.getGameByCode));
router.post('/join-game', asyncHandler(GameHandler.joinGame));
router.post('/start-game', asyncHandler(GameHandler.startGame));
router.post('/start-round', asyncHandler(GameHandler.startRound));
router.post('/end-round', asyncHandler(GameHandler.endRound));
router.post('/add-estimate', asyncHandler(GameHandler.addEstimate));
router.post('/add-plan', asyncHandler(GameHandler.addPlan));
router.post('/add-ready', asyncHandler(GameHandler.addReady));
router.post('/move-ball', asyncHandler(GameHandler.moveBall));
router.post('/end-game', asyncHandler(GameHandler.gameEnd));
router.post('/game-view', asyncHandler(GameHandler.gameViewers));


module.exports = router;
