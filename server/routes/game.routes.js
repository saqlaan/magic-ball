const express = require('express');
const asyncHandler = require('express-async-handler')
const router = express.Router();
const GameHandler = require('../handlers/game.handler')
const GameSchema = require('../validations/game.scheme')
const {tokenAuthentication, validation} = require('../middleware/index.middleware');

router.post('/game-settings', [tokenAuthentication], asyncHandler(GameHandler.gameSettings));
router.get('/get-game/:gameCode', asyncHandler(GameHandler.getGameByCode));
router.post('/join-game', [validation(GameSchema.joinGame)], asyncHandler(GameHandler.joinGame));
router.post('/start-game', [validation(GameSchema.startGame)], asyncHandler(GameHandler.startGame));
router.post('/start-round', [validation(GameSchema.startRound)], asyncHandler(GameHandler.startRound));
router.post('/end-round', [validation(GameSchema.endRound)], asyncHandler(GameHandler.endRound));
router.post('/add-estimate', asyncHandler(GameHandler.addEstimate));
router.post('/add-plan',[validation(GameSchema.addPlan)], asyncHandler(GameHandler.addPlan));
router.post('/add-ready', asyncHandler(GameHandler.addReady));
router.post('/move-ball',[validation(GameSchema.moveBall)], asyncHandler(GameHandler.moveBall));
router.post('/end-game', [validation(GameSchema.endGame)], asyncHandler(GameHandler.gameEnd));
router.post('/add-viewer', [validation(GameSchema.addViewer)], asyncHandler(GameHandler.gameViewers));


module.exports = router;
