var HiwuApi = require('../lib/HiwuApi');
var async = require('async');
var assert = require('assert');
var needle = require('needle');
var spawn = require('child_process').spawn;

describe('Unit Test: HiwuUser', function() {
  describe('HiwuUser',function() {
    var api = new HiwuApi();
    var user;

    before(function(done) {
      api.HiwuUser.simpleLogin('aidistan', 'user', function(err, accessToken) {
        user = accessToken.user;
        done();
      });
    });

    describe('#updateAttributes', function() {
      before(function(done) {
        api.HiwuUser.updateAttributes(user.id, {
          nickname: 'Aidi Stan'
        }, done);
      });

      it('should update fields', function() {
        assert.equal('Aidi Stan', api.lastResult.nickname);
      });
    });

    describe('#updateAvatar', function() {
      before(function(done) {
        api.HiwuUser.updateAvatar(user.id, {
          nickname: 'Aidi',
          avatar: {
            file: 'seeds/chunranbeijing/chunranicon.jpg',
            content_type: 'image/jpeg'
          }
        }, done);
      });

      it('should update fields and avatar', function() {
        assert.equal('Aidi', api.lastResult.nickname);
        assert(api.lastResult.avatar);
      });
    });
  });
});
