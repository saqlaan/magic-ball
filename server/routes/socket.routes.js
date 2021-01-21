const express = require('express');
const router = express.Router();
const socket = require('../socket');
const asyncHandler = require('express-async-handler')

router.get('/info',asyncHandler(info) );

async function info(req,res){
  const connections = {};
  Object.keys(socket.clients).forEach(userId => {
    const {client,createdAt} = socket.clients[userId].client;
    connections[userId] = {
      isAlive: client.isAlive,
      createdAt
    }
  })
  res.json(connections);
}
module.exports = router;
