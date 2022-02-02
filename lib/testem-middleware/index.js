'use strict';
const { join } = require('path');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },
  testemMiddleware: function(app) {
    // invoke the server/index.js that the http-mock blueprint creates
    require(join(this.project.root, 'server'))(app);
  }
};
