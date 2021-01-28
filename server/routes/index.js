const express = require('express');
const router = express.Router();
const gameRoutes = require('./game.routes');
const userRoutes = require('./user.routes');
const socketRoutes = require('./socket.routes');

router.use('/game', gameRoutes);
router.use('/user', userRoutes);
router.use('/socket', socketRoutes)

module.exports = router;
