var HiwuApi = require('./lib/HiwuApi');
var async = require('async');
var api = new HiwuApi();
api.debugger.border = true;
api.debugger.api    = true;
api.debugger.status = true;
api.debugger.body   = true;

task('avatar', function(done) {
  async.series([
    function(cb) {
      api.HiwuUser.simpleLogin('aidistan', 'user', cb);
    },
    function(cb) {
      api.HiwuUser.updateAttributes(api.lastResult.user.id, {
        nickname: 'Aidi Stan'
      }, cb);
    },
    function(cb) {
      api.HiwuUser.updateAvatar(api.lastResult.id, {
        data: {
          file: 'seeds/chunranbeijing/chunranicon.jpg',
          content_type: 'image/jpeg'
        }
      }, cb);
    }
  ], done);
});

task('photo', function(done) {
  async.series([
    function(cb) {
      api.HiwuUser.simpleLogin('aidistan', 'user', cb);
    },
    function(cb) {
      api.HiwuUser.createGallery(api.lastResult.user.id, {
        name: 'Gallery'
      }, cb);
    },
    function(cb) {
      api.Gallery.createItem(api.lastResult.id, {
        name: 'Item'
      }, cb);
    },
    function(cb) {
      api.Item.createPhoto(api.lastResult.id, {
        data: {
          file: 'seeds/chunranbeijing/chunranicon.jpg',
          content_type: 'image/jpeg'
        }
      }, cb);
    },
  ], done);
});

task('comment', function(done) {
  async.series([
    function(cb) {
      api.HiwuUser.simpleLogin('aidistan', 'user', cb);
    },
    function(cb) {
      api.HiwuUser.createGallery(api.lastResult.user.id, {
        name: 'Gallery'
      }, cb);
    },
    function(cb) {
      api.Gallery.createItem(api.lastResult.id, {
        name: 'Item'
      }, cb);
    },
    function(cb) {
      api.Item.createComment(api.lastResult.id, {
        content: 'Fabulours!'
      }, cb);
    }
  ], done);
});

task('like', function(done) {
  var user, item;

  async.series([
    function(cb) {
      api.HiwuUser.simpleLogin('aidistan', 'user', cb);
    },
    function(cb) {
      user = api.lastResult.user;
      api.HiwuUser.createGallery(user.id, {
        name: 'Gallery'
      }, cb);
    },
    function(cb) {
      api.Gallery.createItem(api.lastResult.id, {
        name: 'Item'
      }, cb);
    },
    function(cb) {
      item = api.lastResult;
      api.HiwuUser.linkLike(user.id, api.lastResult.id, cb);
    },
    function(cb) {
      api.Item.getLikers(item.id, cb);
    }
  ], done);
});
