const express = require('express');
const asyncHandler = require('express-async-handler')
const router = express.Router();
const GameHandler = require('../handlers/game.handler')
const GameSchema = require('../validations/game.scheme')
const {tokenAuthentication, validation} = require('../middleware');

router.post('/game-settings', tokenAuthentication, validation(GameSchema.gameSettings), asyncHandler(GameHandler.gameSettings));
router.get('/get-game/:gameCode', asyncHandler(GameHandler.getGameByCode));
router.post('/join-game', validation(GameSchema.joinGame), asyncHandler(GameHandler.joinGame));
router.post('/start-game', validation(GameSchema.startGame), asyncHandler(GameHandler.startRound));
router.post('/start-round', validation(GameSchema.startRound), asyncHandler(GameHandler.startRound));
router.post('/move-ball', validation(GameSchema.moveBall), asyncHandler(GameHandler.moveBall));
router.post('/add-viewer', validation(GameSchema.addViewer), asyncHandler(GameHandler.addViewer));
router.post('/update-round-configuration', asyncHandler(GameHandler.updateRoundConfiguration));
module.exports = router;
