var HiwuApi = require('./index.js');
var needle = require('needle');

function Item(api) {
  this.api = api;
}

Item.prototype = {
  publicView: function(itemId, cb) {
    this.api.get('/api/Items/' + itemId + '/publicView', cb);
  },

  createPhoto: function(itemId, data, cb) {
    this.api.multipost('/api/Items/' + itemId + '/photos', data, cb);
  },

  deletePhoto: function(itemId, photoId, cb) {
    this.api.delete('/api/Items/' + itemId + '/photos/' + photoId, cb);
  },

  deletePhotos: function(itemId, cb) {
    this.api.delete('/api/Items/' + itemId + '/photos', cb);
  },

  getLikers: function(itemId, cb) {
    this.api.get('/api/Items/' + itemId + '/likers', cb);
  },

  createComment: function(itemId, data, cb) {
    this.api.post('/api/Items/' + itemId + '/comments', data, cb);
  }
};

module.exports = Item;
