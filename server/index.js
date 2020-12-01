// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})



if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}
server.listen(config.wsPort, function() {
  console.log(`Server is listening on ${config.wsPort}!`)
})
module.exports = app;
