const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");


async function signup(req, res) {

  let errors = [];
  if (req.body.firstName === undefined || req.body.firstName === '') {
    errors.push("firstName is required");
  }
  if (req.body.lastName === undefined || req.body.lastName === '') {
    errors.push("lastName is required");
  }
  if (req.body.email === undefined || req.body.email === '') {
    errors.push("email is required");
  }
  if (req.body.country === undefined || req.body.country === '') {
    errors.push("country is required");
  }
  if (req.body.city === undefined || req.body.city === '') {
    errors.push("city is required");
  }
  if (req.body.occupation === undefined || req.body.occupation === '') {
    errors.push("occupation is required");
  }
  if (req.body.password === undefined || req.body.password === '') {
    errors.push("password is required");
  }
  if (req.body.type === undefined || req.body.type === '') {
    errors.push("type is required");
  }
  if (errors.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    let user = await userCtrl.insert(req.body);
    if (user) {
      res.json({
        message: "you are registered"
      });
    } else {
      res.status(400).json({
        message: "not registered successfully"
      });
    }
  } else {
    res.status(400).json({
      errors
    })
  }
}

async function login(req, res) {
  let errors = [];

  if (req.body.email === undefined || req.body.email === '') {
    errors.push("email is required");
  }

  if (req.body.password === undefined || req.body.password === '') {
    errors.push("password is required");
  }


  if (errors.length === 0) {
    let user = await userCtrl.findByEmail(req.body.email);
    if (user) {
      bcrypt.compare(req.body.password, user.password, async function (err, result) {
        if (result) {
          const payLoad = {email: user.email, firstName: user.firstName, lastName: user.lastName, id: user._id};
          const token = jwt.sign(payLoad, process.env.JWT_SECRET);
          let update = await userCtrl.updateToken(user._id, token);
          update = update.toObject();
          delete update.password;
          res.json({
            userToken: update.token,
            userId: update._id
          });
        } else {
          res.status(400).json({
            message: 'passsword not correct',
          })
        }
      })
    } else {
      res.status(404).json({
        message: "email not exist"
      })
    }
  } else {
    res.status(404).json(errors);
  }
}


async function updateProfile(req, res) {

  let errors = [];

  if (req.body.firstName === undefined || req.body.firstName === '') {
    errors.push("firstName is required");
  }
  if (req.body.lastName === undefined || req.body.lastName === '') {
    errors.push("lastName is required");
  }
  if (req.body.country === undefined || req.body.country === '') {
    errors.push("country is required");
  }

  if (req.body.city === undefined || req.body.city === '') {
    errors.push("city is required");
  }

  if (req.body.occupation === undefined || req.body.occupation === '') {
    errors.push("occupation is required");
  }

  if (errors.length === 0) {

    let user = await userCtrl.updateUser(req.body, req.user.id);
    if (user) {
      res.json({
        message: 'User Updated Successfully'
      });
    } else {
      res.status(404).json({
        message: ' User not found'
      })
    }
  } else {
    res.status(404).json({
      errors
    })
  }
}

async function forgotPassword(req, res) {
  let errors = [];
  if (req.body.email === undefined || req.body.email === '') {
    errors.push("email is required");
  }

  if (errors.length === 0) {
    let user = await userCtrl.findByEmail(req.body.email);
    if (user) {
      const payLoad = {email: user.email, id: user._id};
      const secret = process.env.JWT_SECRET;
      const resetToken = jwt.sign(payLoad, secret);
      let update = await userCtrl.resetPasswordToken(user._id, resetToken);

      let link = "http://" + req.headers.host + "/api/user/reset/" + update.resetPasswordToken;
      res.json({
        resetToken: update.resetPasswordToken
      });
    } else {
      res.json({
        message: "user not found",

      })
    }
  } else {
    res.json({
      errors
    })
  }
}

async function resetPassword(req, res) {
  console.log(req.body)
  let errors = [];
  if (req.body.password === undefined || req.body.password === '') {
    errors.push("password is required");
  }
  if (req.body.resetPasswordToken === undefined || req.body.resetPasswordToken === '') {
    errors.push("resetPasswordToken is required");
  }


  if (errors.length === 0) {
    let user = await userCtrl.resetPassword(req.body.resetPasswordToken, req.body.password);
    if (user) {
      res.json({
        message: "user is updated",
      })
    } else {
      res.json({
        message: "user not updated",
      })
    }
  } else {
    res.json({
      errors
    })
  }
}

async function getProfile(req, res) {
  let errors = [];
  if (req.body.userId === undefined || req.body.userId === '') {
    errors.push("UserId is required");
  }
  if (errors.length === 0) {
    let user = await userCtrl.findById(req.body.userId);
    if (user) {
      res.status(200).json({
        "firstName": user.firstName,
        "lastName": user.lastName,
        "country": user.country,
        "city": user.city,
        "occupation": user.occupation
      })
    } else {
      res.status(404).json({
        message: "user not Found",
      })
    }
  } else {
    res.status(404).json({
      errors
    })
  }
}

async function guestLogin(req, res) {
  let errors = [];

  if (req.body.email === undefined || req.body.email === '') {
    errors.push("email is required");
  }
  if (req.body.organization === undefined || req.body.organization === '') {
    errors.push("organization is required");
  }

  if (errors.length === 0) {
    let user = await userCtrl.insert(req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: "user not inserted",
      })
    }
  } else {
    res.status(404).json(errors);
  }

}

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
  signup, login, updateProfile, forgotPassword, resetPassword, getProfile, guestLogin, gameSettings, addPlayer
}
