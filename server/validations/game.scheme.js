const Joi = require('joi');
const GameScheme = {
  gameSettings: Joi.object().keys({
    groupName: Joi.string().required(),
    maxPlayers: Joi.number().min(4).required(),
    noOfRounds: Joi.number().min(1).required(),
    timePerSecond: Joi.number().min(1).required(),
    save_metrics: Joi.boolean().required(),
    access_toolbox: Joi.boolean().required(),
    ballsPerRound: Joi.number().min(1).required(),
    players: Joi.array()
  }),
  joinGame: Joi.object().keys({
    playerId: Joi.string().required(),
    gameCode: Joi.string().required(),
  }),
  startGame: Joi.object().keys({
    gameId: Joi.string().required(),
  }),
  startRound: Joi.object().keys({
    gameId: Joi.string().required(),
  }),
  endRound: Joi.object().keys({
    gameId: Joi.string().required(),
  }),
  endGame: Joi.object().keys({
    gameId: Joi.string().required(),
  }),
  addViewer: Joi.object().keys({
    viewerId: Joi.string().required(),
  }),
  addEstimate: Joi.object().keys({
    gameId: Joi.string().required(),
    ballsEstimate: Joi.number().min(1).required()
  }),
  addReady: Joi.object().keys({
    gameId: Joi.string().required(),
    archWizard: Joi.string(),
    timeKeeper: Joi.string(),
    scoreKeeper: Joi.string(),
    ballsEstimate: Joi.string(),
  }),
  addPlan: Joi.object().keys({
    gameId: Joi.string().required(),
    arrangement: Joi.required(),
  }),
  moveBall: Joi.object().keys({
    gameId: Joi.string().required(),
    playerId: Joi.string().required(),
  }),
  updateGameSettings: Joi.object().keys({
    gameId: Joi.string().required(),
    gameData: Joi.object().required()
  }),
}


module.exports = GameScheme;
