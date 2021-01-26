const Joi = require('joi');
const GameScheme = {
  gameSettings: Joi.object().keys({
    firstName: Joi.string().required(),

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
}


module.exports = GameScheme;
