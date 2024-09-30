/* eslint-disable prettier/prettier */
'use strict';

const data = require('./data.json');

module.exports = function(app) {
  app.get('/data.json', (req, res) => {
    res.send(data);
  });
};
