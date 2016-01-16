var HiwuApi = require('../lib/HiwuApi');
var async = require('async');
var assert = require('assert');
var needle = require('needle');
var spawn = require('child_process').spawn;

describe('Integration Test: Public Views', function () {
  this.timeout(3000);

  var api;
  var server;

  var hiwuUser;
  var privateGallery;
  var publicGallery;
  var privateItem;
  var publicItem;

  before(function(done) {
    api = new HiwuApi();

    async.series([
      function(cb) {
        api.HiwuUser.login({
          username: 'hiwu.ren',
          password: 'duludou!'
        }, 'user', cb);
      },
      function(cb) {
        hiwuUser = api.lastResult.user;
        async.parallel([
          function(cb) {
            api.HiwuUser.createGallery(api.lastResult.user.id, {
              name: 'Public Gallery'
            }, function(err, gallery) {
              publicGallery = gallery;

              api.Gallery.createItem(gallery.id, {
                name: 'Public Item',
              }, function(err, item) {
                publicItem = item;

                api.Gallery.createItem(gallery.id, {
                  name: 'Private Item',
                  public: false
                }, function(err, item) {
                  privateItem = item;

                  api.SelectedGallery.create({
                    date_y: 2015,
                    galleryId: gallery.id
                  }, function(err) {

                    // Create a newer one
                    api.SelectedGallery.create({
                      date_y: 2016,
                      galleryId: gallery.id
                    }, cb);
                  });
                });
              });
            });
          },
          function(cb) {
            api.HiwuUser.createGallery(api.lastResult.user.id, {
              name: 'Private Gallery',
              public: false
            }, function(err, gallery) {
              privateGallery = gallery;

              api.SelectedGallery.create({
                galleryId: gallery.id
              }, cb);
            });
          }
        ], cb);
      }
    ], done);
  });

  describe('HiwuUser', function() {
    describe('#publicView', function () {
      before(function(done) {
        api.HiwuUser.publicView(hiwuUser.id, function(err, res) {
          hiwuUser = res;
          done();
        });
      });

      it('should return public galleries', function(done) {
        assert(hiwuUser.galleries.length > 0);
        async.each(hiwuUser.galleries, function(gallery, cb) {
          testPublicGallery(gallery);
          cb();
        }, done);
      });
    });
  });

  describe('Gallery', function() {
    describe('#publicView', function () {
      it('should not return if private', function(done) {
        api.Gallery.publicView(privateGallery.id, function(err, gallery) {
          assert(gallery.error);
          assert.equal('PRIVATE_MODEL_VISITED', gallery.error.code);
          done();
        });
      });

      it('should return if public', function(done) {
        api.Gallery.publicView(publicGallery.id, function(err, gallery) {
          assert(gallery.hiwuUser);
          testPublicGallery(gallery);
          done();
        });
      });
    });
  });

  describe('Item', function() {
    describe('#publicView', function () {
      it('should not return if private', function(done) {
        api.Item.publicView(privateItem.id, function(err, item) {
          assert(item.error);
          assert.equal('PRIVATE_MODEL_VISITED', item.error.code);
          done();
        });
      });

      it('should return for logined users if public', function(done) {
        api.Item.publicView(publicItem.id, function(err, item) {
          assert(item.hiwuUser);
          testPublicItem(item);
          assert(item.likes !== undefined);
          assert(item.liked !== undefined);
          assert(item.comments);
          done();
        });
      });

      it('should return for anonymous users if public', function(done) {
        var accessToken = api.accessToken;
        api.accessToken = null;
        api.Item.publicView(publicItem.id, function(err, item) {
          assert(item.hiwuUser);
          testPublicItem(item);
          assert(item.likes !== undefined);
          assert(item.liked === undefined);
          assert(item.comments);
          api.accessToken = accessToken;
          done();
        });
      });
    });
  });

  describe('SelectedGallery', function () {
    describe('#publicView', function () {
      var entries;

      before(function(done) {
        api.SelectedGallery.publicView(function(err, res) {
          entries = res;
          done();
        });
      });

      it('should return public galleries with related models', function(done) {
        assert(entries.length > 0);
        async.each(entries, function(entry, cb) {
          if (entry.gallery) {
            testPublicGallery(entry.gallery);
            assert(entry.gallery.hiwuUser);
          }
          cb();
        }, done);
      });

      it('should return newest galleries first', function() {
        assert(entries[0].date_y >= entries[1].date_y);
      });
    });
  });

  function testPublicGallery(gallery) {
    assert(gallery.public);
    assert(gallery.items);
    for(var i in gallery.items)
      testPublicItem(gallery.items[i]);
  }

  function testPublicItem(item) {
    assert(item.public);
    assert(item.photos);
  }
});
