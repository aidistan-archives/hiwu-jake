var HiwuApi = require('./lib/HiwuApi');
var async = require('async');
var fs = require('fs');
var yml = require('js-yaml');

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
        nickname: 'Aidi Stan',
        avatar: {
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
  var user;

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
      api.HiwuUser.linkLike(user.id, api.lastResult.id, cb);
    }
  ], done);
});

namespace('seeds', function() {
  desc('Check yaml files of all seeds');
  task('check', function() {
    fs.readdirSync('seeds').forEach(function(username) {
      yml.load(
        fs.readFileSync(
          'seeds/' + username + '/' + username + '.yml'
        ).toString()
      ).galleries.forEach(function(gallery) {
        console.log('[G] ' + gallery.name);
        gallery.items.forEach(function(item) {
          console.log('[I] ' + item.name);
          item.photos.forEach(function(photo) {
            console.log('[P] ' + photo.data.file);
          });
        });
      });
    });
  });

  desc('Upload all seeds to the server');
  task('upload', function() {
    api.config(function(_api) {
      var api = new HiwuApi(_api.host, _api.port);
      api.debugger.api = true;

      async.eachSeries(fs.readdirSync('seeds'), function(username, cb) {
        api.accessToken = null;

        api.HiwuUser.login({
          email: username + '@simple.hiwu.ren',
          password: username
        }, '', function(err, accessToken) {
          if (accessToken.error === undefined) return;
          var seed = yml.load(
            fs.readFileSync(
              'seeds/' + username + '/' + username + '.yml'
            ).toString()
          );

          api.HiwuUser.simpleLogin(username, '', function(err, accessToken) {
            async.series([
              function(cb) {
                var galleries = seed.galleries;
                delete seed.galleries;

                async.eachSeries(galleries, function(gallery, cb) {
                  var items = gallery.items;
                  delete gallery.items;
                  api.HiwuUser.createGallery(accessToken.userId, gallery, function(err, gallery) {
                    async.eachSeries(items, function(item, cb) {
                      var photos = item.photos;
                      delete item.photos;
                      api.Gallery.createItem(gallery.id, item, function(err, item) {
                        async.eachSeries(photos, function(photo, cb) {
                          api.Item.createPhoto(item.id, photo, cb);
                        }, cb);
                      });
                    }, cb);
                  });
                }, cb);
              },
              function(cb) {
                api.HiwuUser.updateAvatar(accessToken.userId, {
                  avatar: seed.avatar
                }, cb);
                delete seed.avatar;
              },
              function(cb) {
                api.HiwuUser.updateAttributes(accessToken.userId, seed, cb);
              }
            ], cb)
          });
        });
      });
    });
  });
});
