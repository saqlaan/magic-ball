// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const server = http.createServer(express);
const wss = new WebSocket.Server({ server })




if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
