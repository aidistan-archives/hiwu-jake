var HiwuApi = require('../lib/HiwuApi');
var async = require('async');
var assert = require('assert');
var needle = require('needle');
var spawn = require('child_process').spawn;

describe('Unit Test: Notification', function () {
  describe('Notification', function() {
    var api = new HiwuApi();

    var ownerToken;
    var guestToken;
    var item;

    before(function(done) {
      async.series([
        function(cb) {
          api.HiwuUser.login({
            username: 'hiwu.ren',
            password: 'duludou!'
          }, 'user', function(err, accessToken) {
            ownerToken = accessToken;
            cb();
          });
        },
        function(cb) {
          api.HiwuUser.createGallery(api.lastResult.user.id, {
            name: 'Gallery'
          }, cb);
        },
        function(cb) {
          api.Gallery.createItem(api.lastResult.id, {
            name: 'Item'
          }, function(err, res) {
            item = res;
            cb();
          });
        },
        function(cb) {
          api.accessToken = null;
          api.HiwuUser.simpleLogin('aidistan', 'user', function(err, accessToken) {
            guestToken = accessToken;
            done();
          });
        }
      ], done);
    });

    describe('#getNotifications', function() {
      it('should get notifications', function(done) {
        api.accessToken = guestToken;
        api.HiwuUser.getNotifications(guestToken.userId, done);
      });
    });

    describe('#deleteNotifications', function() {
      it('should delete notifications', function(done) {
        api.accessToken = guestToken;
        api.HiwuUser.deleteNotifications(guestToken.userId, function(err, res) {
          assert.equal('', res);
          done();
        });
      });
    });

    describe('ITEM_LIKE', function () {
      beforeEach(function(done) {
        api.accessToken = ownerToken;
        api.HiwuUser.deleteNotifications(ownerToken.userId, done);
      });

      it('should send notifications when items liked by others', function(done) {
        api.accessToken = guestToken;
        api.HiwuUser.linkLike(guestToken.userId, item.id, function(err, like) {
          api.accessToken = ownerToken;
          api.HiwuUser.getNotifications(ownerToken.userId, function(err, notifications) {
            assert.equal(1, notifications.length);
            var notification = notifications[0];

            assert.equal('ITEM_LIKE', notification.type);
            assert.equal(guestToken.userId, notification.fromId);
            assert.equal(item.id, notification.itemId);
            done();
          });
        });
      });

      it('should not send notifications when items liked by self', function(done) {
        api.accessToken = ownerToken;
        api.HiwuUser.linkLike(ownerToken.userId, item.id, function(err, like) {
          api.HiwuUser.getNotifications(ownerToken.userId, function(err, notifications) {
            assert.equal(0, notifications.length);
            done();
          });
        });
      });
    });

    describe('ITEM_COMMENT', function() {
      beforeEach(function(done) {
        api.accessToken = ownerToken;
        api.HiwuUser.deleteNotifications(ownerToken.userId, done);
      });

      it('should send notifications when items commented by others', function(done) {
        api.accessToken = guestToken;
        api.Item.createComment(item.id, {
          content: 'Fabulous!'
        }, function(err, comment) {
          api.accessToken = ownerToken;
          api.HiwuUser.getNotifications(ownerToken.userId, function(err, notifications) {
            assert.equal(1, notifications.length);
            var notification = notifications[0];

            assert.equal('ITEM_COMMENT', notification.type);
            assert.equal(guestToken.userId, notification.fromId);
            assert.equal(item.id, notification.itemId);
            assert.equal(comment.id, notification.commentId);
            done();
          });
        });
      });

      it('should not send notifications when items commented by self', function(done) {
        api.accessToken = ownerToken;
        api.Item.createComment(item.id, {
          content: 'Fabulous!'
        }, function(err, comment) {
          api.HiwuUser.getNotifications(ownerToken.userId, function(err, notifications) {
            assert.equal(0, notifications.length);
            done();
          });
        });
      });
    });

    describe('COMMENT_REPLY', function() {
      var comment;

      before(function(done) {
        api.accessToken = guestToken;
        api.Item.createComment(item.id, {
          content: 'How are you?'
        }, function(err, res) {
          comment = res;
          done();
        });
      });

      it('should send notifications when comments replyed', function(done) {
        api.accessToken = ownerToken;
        api.Item.createComment(item.id, {
          content: 'Fine. Thank you, and you?',
          toId: comment.userId
        }, function(err, comment) {
          api.accessToken = guestToken;
          api.HiwuUser.getNotifications(guestToken.userId, function(err, notifications) {
            var notification = notifications[notifications.length - 1];
            assert.equal('COMMENT_REPLY', notification.type);
            assert.equal(ownerToken.userId, notification.fromId);
            assert.equal(item.id, notification.itemId);
            assert.equal(comment.id, notification.commentId);
            done();
          });
        });
      });
    });
  });
});
