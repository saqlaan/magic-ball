const MyWebsocket = require('../socket');
const WebSocket = require('ws');


module.exports = function (app) {
const server = require('http').createServer(app);
global.wss = new WebSocket.Server({server})
global.wss.on('connection', MyWebsocket.connect);
global.wss.on('error', function (e) {
  console.log(e);
})
  return server;
};
