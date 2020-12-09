const express = require('express');
const gameRoutes = require('./game.routes');
const playerRoutes = require('./player.route');


const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


router.use('/game', gameRoutes);

router.use('/player', playerRoutes);

module.exports = router;
