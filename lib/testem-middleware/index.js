'use strict';
const { join } = require('path');
const data = require('../../server/mocks/data.json');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },
  testemMiddleware: function (app) {
    app.get('/data.json', (req, res) => {
      res.send(data);
    });
  },
};
