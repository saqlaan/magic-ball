const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");




async function gameSettings(req, res) {
  let errors = [];
  if (req.body.groupName === undefined || req.body.groupName === '') {
    errors.push("groupName is required");
  }
  if (req.body.groupSize === undefined || req.body.groupSize === '') {
    errors.push("groupSize is required");
  }
  if (req.body.rounds === undefined || req.body.rounds === '') {
    errors.push("rounds is required");
  }
  if (req.body.balls === undefined || req.body.balls === '') {
    errors.push("balls is required");
  }
  if (req.body.status === undefined || req.body.status === '') {
    errors.push("status is required");
  }


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

async function addPlayer(req, res) {

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
   gameSettings, addPlayer
}
