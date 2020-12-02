// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
const socketApp = require('./config/socket');
require('./config/mongoose');



if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
  socketApp.listen(config.websocketPort, () => {
    console.info(`websocket started on port ${config.websocketPort} (${config.env})`);
  });
}

module.exports = app;
