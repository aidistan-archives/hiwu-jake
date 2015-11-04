var HiwuApi = require('./index.js');
var needle = require('needle');

function Today(api) {
  this.api = api;
}

Today.prototype = {
  create: function(data, cb) {
    this.api.post('/api/Today', data, cb);
  },

  publicView: function(cb) {
    this.api.get('/api/Today/publicView', cb);
  }
};

module.exports = Today;
