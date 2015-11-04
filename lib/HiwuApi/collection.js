var HiwuApi = require('./index.js');
var needle = require('needle');
var querystring = require('querystring');

function Collection(api) {
  this.api = api;
}

Collection.prototype = {
  create: function(data, cb) {
    this.api.post('/api/Collections', data, cb);
  },

  createItem: function(collectionId, data, cb) {
    this.api.post('/api/Collections/' + collectionId + '/items', data, cb);
  },

  find: function(filter, cb) {
    var api = this.api;
    var accessToken = api.accessToken;
    api.accessToken = null;

    this.api.get('/api/Collections?access_token=' + accessToken.id +
        '&filter=' + JSON.stringify(filter || {}) ,
      function(err, collections) {
        api.accessToken = accessToken;
        cb(err, collections);
      }
    );
  },

  findById: function(collectionId, filter, cb) {
    var api = this.api;
    var accessToken = api.accessToken;
    api.accessToken = null;

    this.api.get('/api/Collections/'+ collectionId + '?access_token=' + accessToken.id +
        '&filter=' + JSON.stringify(filter || {}) ,
      function(err, collection) {
        api.accessToken = accessToken;
        cb(err, collection);
      }
    );
  }
};

module.exports = Collection;
