// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
const socketApp = require('./config/socket')(app);
require('./config/mongoose');



if (!module.parent) {
  socketApp.listen(config.port, () => {
    console.info(`started on port ${config.port} (${config.env})`);
  });
}

module.exports = socketApp;
