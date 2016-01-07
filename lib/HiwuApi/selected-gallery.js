var HiwuApi = require('./index.js');
var needle = require('needle');

function SelectedGallery(api) {
  this.api = api;
}

SelectedGallery.prototype = {
  create: function(data, cb) {
    this.api.post('/api/SelectedGalleries', data, cb);
  },

  publicView: function(cb) {
    this.api.get('/api/SelectedGalleries/publicView', cb);
  }
};

module.exports = SelectedGallery;
