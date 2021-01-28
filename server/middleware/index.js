const tokenAuthentication = require('./tokenAuthentication.middleware');
const validation = require('./validation.middleware');

module.exports = {
  tokenAuthentication,
  validation
}
