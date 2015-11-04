var HiwuApi = require('./index.js');
var needle = require('needle');

function HiwuUser(api) {
  this.api = api;
}

HiwuUser.prototype = {
  login: function(data, include, cb) {
    var api = this.api;
    api.post(
      '/api/HiwuUsers/login' + (include ? '?include=' + include : ''),
      data, function(err, accessToken) {
        if (accessToken.error === undefined) api.accessToken = accessToken;
        if (cb) cb(err, accessToken);
      }
    );
  },

  simpleLogin: function(username, include, cb) {
    var api = this.api;
    api.post(
      '/api/HiwuUsers/simpleLogin?username=' + username +
          (include ? '&include=' + include : ''),
      null, function(err, accessToken) {
        if (accessToken.error === undefined) api.accessToken = accessToken;
        if (cb) cb(err, accessToken);
      }
    );
  },

  updateAttributes: function(userId, data, cb) {
    this.api.put('/api/HiwuUsers/' + userId, data, cb);
  },

  // 由于 needle 目前上传 multipart 时编码存在 bug
  // 使用 updataAvatar 上传字符数据仅限 ASCII，中文字符请用 update
  updateAvatar: function(userId, data, cb) {
    this.api.multiput('/api/HiwuUsers/' + userId + '/avatar', data, cb);
  },

  createGallery: function(userId, data, cb) {
    this.api.post('/api/HiwuUsers/' + userId + '/galleries', data, cb);
  },

  publicView: function(userId, cb) {
    this.api.get('/api/HiwuUsers/' + userId + '/publicView', cb);
  },

  linkLike: function(userId, itemId, cb) {
    this.api.put('/api/HiwuUsers/' + userId + '/likes/rel/' + itemId, null, cb);
  },

  unlinkLike: function(userId, itemId, cb) {
    this.api.delete('/api/HiwuUsers/' + userId + '/likes/rel/' + itemId, cb);
  },

  getNotifications: function(userId, cb) {
    this.api.get('/api/HiwuUsers/' + userId + '/notifications', cb);
  },

  deleteNotification: function(userId, notificationId, cb) {
    this.api.delete('/api/HiwuUsers/' + userId + '/notifications/' + notificationId, cb);
  },

  deleteNotifications: function(userId, cb) {
    this.api.delete('/api/HiwuUsers/' + userId + '/notifications', cb);
  },
};

module.exports = HiwuUser;
