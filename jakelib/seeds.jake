var HiwuApi = require('../lib/HiwuApi');
var async = require('async');
var fs = require('fs');
var yml = require('js-yaml');
var api = new HiwuApi();

namespace('seeds', function() {
  desc('Check yaml files of all seeds');
  task('check', function() {
    fs.readdirSync('seeds').forEach(function(username) {
      var seed = yml.load(
        fs.readFileSync('seeds/' + username + '/' + username + '.yml').toString()
      );
      fs.accessSync(seed.avatar.file);

      console.log('[U] ' + username);
      seed.galleries.forEach(function(gallery) {
        console.log('[G] ' + gallery.name);
        gallery.items.forEach(function(item) {
          console.log('[I] ' + item.name);
          item.photos.forEach(function(photo) {
            console.log('[P] ' + photo.data.file);
            fs.accessSync(photo.data.file);
          });
        });
      });
    });
  });

  desc('Upload all seeds to the server');
  task('upload', function() {
    api.config(function() {
      var apI = new HiwuApi(api.host, api.port);
      api.debugger.api = true;

      apI.HiwuUser.login({
        username: 'hiwu.ren',
        password: 'duludou!'
      }, '', function() {
        async.eachSeries(fs.readdirSync('seeds'), function(username, cb) {
          api.accessToken = null;

          api.HiwuUser.login({
            email: username + '@example.com',
            password: username
          }, '', function(err, accessToken) {
            if (accessToken.error === undefined) return cb(null);
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
                    var match = /(\d+)-(\d+)-(\d+)-/.exec(gallery.items[0].photos[0].data.file);
                    delete gallery.items;

                    api.HiwuUser.createGallery(accessToken.userId, gallery, function(err, gallery) {
                      apI.SelectedGallery.create({
                        date_y: match[1],
                        date_m: match[2],
                        date_d: match[3],
                        galleryId: gallery.id
                      });

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
              ], cb);
            });
          });
        })
      });
    });
  });
});
