const MyWebsocket = require('../socket');
const WebSocket = require('ws');
function noop() {}

module.exports = function (app) {
  const server = require('http').createServer(app);
  global.wss = new WebSocket.Server({server})
  global.wss.on('connection', MyWebsocket.connect);

  const interval = setInterval(function ping() {
    global.wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);

  global.wss.on('close', function close() {
    clearInterval(interval);
  });
  global.wss.on('error', function (e) {
    console.log(e);
  })
  return server;
};
