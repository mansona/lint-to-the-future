'use strict';
// eslint-disable-next-line n/no-unpublished-require
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
