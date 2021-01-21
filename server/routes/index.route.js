const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const gameRoutes = require('./game.routes');
const playerRoutes = require('./player.route');
const userRoutes = require('./user.routes');
const socketRoutes = require('./socket.routes');




/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


router.use('/game', gameRoutes);
router.use('/user', userRoutes);
router.use('/player', playerRoutes);
router.use('/socket', socketRoutes)

module.exports = router;
