const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/user.controller');
const gameCtrl = require("../controllers/game.controller");
const escapeStringRegexp = require('escape-string-regexp');


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
    let email = await userCtrl.findByEmail(req.body.email);
    if (!email) {
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
      res.json({
        message: "email is already exist"
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
            res.json(update);
            // if (!user.token) {
            //   const payLoad = {email: user.email, firstName: user.firstName, lastName: user.lastName, id: user._id};
            //   const token = jwt.sign(payLoad, process.env.JWT_SECRET);
            //   let update = await userCtrl.updateToken(user._id, token);
            //   update = update.toObject();
            //   delete update.password;
            //   res.json(update);
            // } else {
            //   res.status(400).json({
            //     message: 'you are  already loggedIn',
            //   })
            // }
          } else {
            res.status(400).json({
              message: 'passsword not correct',
            })
          }
        }
      )
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
        message: 'Profile Updated Successfully'
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

      let link = "http://" + req.headers.host + "/hostresetpassword/";
      console.log(link)
      let nodemailer = require('nodemailer');
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'usamaijazksr@gmail.com',
          pass: 'usama.0900'
        }
      });

      let mailOptions = {
        from: 'usamaijazksr@gmail.com',
        to: user.email,
        subject: 'Reset your Password',
        text: 'That was easy!',
        html: link
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.json({
        resetToken: update.resetPasswordToken
      });
    } else {
      res.status(404).json({
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
        message: "Password is updated",
      })
    } else {
      res.json({
        message: "password not updated",
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


async function updatePassword(req, res) {

  let errors = [];

  if (req.body.oldPassword === undefined || req.body.oldPassword === '') {
    errors.push("oldPassword is required");
  }

  if (req.body.newPassword === undefined || req.body.newPassword === '') {
    errors.push("newPassword is required");
  }

  if (errors.length === 0) {

    let user = await userCtrl.findById(req.user.id);

    if (user) {
      bcrypt.compare(req.body.oldPassword, user.password, async function (err, result) {
        if (result) {
          let user = await userCtrl.updatePassword(req.body.newPassword, req.user.id);
          if (user) {
            res.json({
              message: 'Password Updated Successfully'
            });
          } else {
            res.status(404).json({
              message: ' Password is not Updated Successfully'
            })
          }
        } else {
          res.status(400).json({
            message: 'currentPasssword is not correct',
          })
        }
      })
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  } else {
    res.status(404).json({
      errors
    })


  }
}

async function searchPlayer(req, res) {
  let errors = [];

  if (req.body.playerName === undefined || req.body.playerName === '') {
    errors.push("playerName is required");
  }

  if (errors.length === 0) {
    let player = await userCtrl.searchPlayer(req.body.playerName);
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({
        message: 'player not found'
      })
    }
  } else {
    res.status(404).json(errors);
  }
}

async function logout(req, res) {
  let errors = [];

  if (req.body.userId === undefined || req.body.userId === '') {
    errors.push("userId is required");
  }
  if (errors.length === 0) {
    let user = await userCtrl.findById(req.body.userId);
    if (user) {
      let updateUser = await userCtrl.removeToken(req.body.userId);
      if (updateUser) {
        res.json({
          message: "you are loggedout succesfully"
        })
      } else {
        res.status(404).json({
          message: "user not logged out"
        })
      }
    } else {
      res.status(404).json({
        message: "user not found"
      })
    }
  } else {
    res.status(404).json(errors);
  }
}


module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
  getProfile,
  guestLogin,
  updatePassword,
  searchPlayer
}
