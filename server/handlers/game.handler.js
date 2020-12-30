const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");

async function gameSettings(req, res) {
  let errors = [];
  if (errors.length === 0) {
    let game = await gameCtrl.insert(req.body);
    if (game) {
      res.status(200).json(game);
    } else {
      res.status(404).json({
        message: "Game is not added",
      })
    }
  } else {
    res.status(404).json(errors);
  }

}

async function getGameByCode(req, res) {
  let errors = [];

  if (req.params.gameCode === undefined || req.params.gameCode === '') {
    errors.push("gameId is required");
  }
  if (errors.length === 0) {
    let game = await gameCtrl.findGameByCode(req.params.gameCode);
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({
        message: 'game not found'
      });
    }

  } else {
    res.status(404).json({
      errors
    });
  }

}

async function joinGame(req, res) {

  let errors = [];
  if (req.body.gameCode === undefined || req.body.gameCode === '') {
    errors.push("gameCode is required");
  }
  if (req.body.playerId === undefined || req.body.groupSize === '') {
    errors.push("playerId is required");
  }

  if (errors.length === 0) {
    let game = await gameCtrl.addUserInGame(req.body);
    if (game) {
      return res.json(game);
    } else {
      res.status(404).json({
        message: "Game not Found",
      })
    }
  } else {
    res.status(404).json(errors);
  }
}

module.exports = {
  gameSettings, joinGame, getGameByCode
}
