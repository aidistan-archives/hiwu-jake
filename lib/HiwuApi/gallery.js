var HiwuApi = require('./index.js');
var needle = require('needle');

function Gallery(api) {
  this.api = api;
}

Gallery.prototype = {
  createItem: function(galleryId, data, cb) {
    this.api.post('/api/Galleries/' + galleryId + '/items', data, cb);
  },

  publicView: function(galleryId, cb) {
    this.api.get('/api/Galleries/' + galleryId + '/publicView', cb);
  },
};

module.exports = Gallery;
