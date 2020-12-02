const logger = require('morgan');
const config = require('./config');
const MyWebsocket = require('../socket');
const WebSocket = require('ws');
var app = require('express')();


if (config.env === 'development') {
  app.use(logger('dev'));
}

const server = require('http').createServer(app);
global.wss = new WebSocket.Server({server})
global.wss.on('connection', MyWebsocket.connect);
module.exports = server;
