var needle = require('needle');

function HiwuApi(host, port) {
  this.host = host || '0.0.0.0';
  this.port = port || '3000';

  this.accessToken = null;
  this.lastResult = undefined;
  this.debugger = {
    border: false,
    api: false,
    status: false,
    body: false
  };

  this.HiwuUser   = new (require('./hiwu-user'))(this);
  this.Item       = new (require('./item'))(this);
  this.Gallery    = new (require('./gallery'))(this);
  this.Collection = new (require('./collection'))(this);
  this.Today      = new (require('./today'))(this);
}

HiwuApi.prototype = {
  config: function(cb) {
    var api = this;

    var rl = require('readline').createInterface({
      input: process.stdin,
      output:process.stdout
    });

    rl.question('Which host? (' + api.host + ')', function(host) {
      if (host.length > 0)
        api.host = host;

      rl.question('Which port? (' + api.port + ')', function(port) {
        if (port.length > 0)
          api.port = port;

        rl.close();
        cb(api);
      });
    });
  },

  url: function(path) {
    path = path || '';
    return 'http://' + this.host + ':' + this.port + path;
  },

  post: function(path, data, cb) {
    var api = this;

    if (api.debugger.border)
      console.log('====================');
    if (api.debugger.api)
      console.log('POST: ' + path);
    if (api.accessToken)
      path += '?access_token=' + api.accessToken.id;

    needle.post(api.url(path), data, {accept: 'application/json'}, function(err, res) {
      if (err) throw err;
      if (api.debugger.status)
        console.log('STATUS: ' + res.statusCode);
      if (api.debugger.body)
        console.log('BODY: ' + JSON.stringify(res.body));
      api.lastResult = res.body;
      if (cb) cb(err, res.body);
    });
  },

  multipost: function(path, data, cb) {
    var api = this;

    if (api.debugger.border)
      console.log('====================');
    if (api.debugger.api)
      console.log('POST: ' + path);
    if (api.accessToken)
      path += '?access_token=' + api.accessToken.id;

    needle.post(api.url(path), data, {accept: 'application/json', multipart: true}, function(err, res) {
      if (err) throw err;
      if (api.debugger.status)
        console.log('STATUS: ' + res.statusCode);
      if (api.debugger.body)
        console.log('BODY: ' + JSON.stringify(res.body));
      api.lastResult = res.body;
      if (cb) cb(err, res.body);
    });
  },

  get: function(path, cb) {
    var api = this;

    if (api.debugger.border)
      console.log('====================');
    if (api.debugger.api)
      console.log('GET: ' + path);
    if (api.accessToken)
      path += '?access_token=' + api.accessToken.id;

    needle.get(api.url(path), {accept: 'application/json'}, function(err, res) {
      if (err) throw err;
      if (api.debugger.status)
        console.log('STATUS: ' + res.statusCode);
      if (api.debugger.body)
        console.log('BODY: ' + JSON.stringify(res.body));
      api.lastResult = res.body;
      if (cb) cb(err, res.body);
    });
  },

  put: function(path, data, cb) {
    var api = this;

    if (api.debugger.border)
      console.log('====================');
    if (api.debugger.api)
      console.log('PUT: ' + path);
    if (api.accessToken)
      path += '?access_token=' + api.accessToken.id;

    needle.put(api.url(path), data, {accept: 'application/json'}, function(err, res) {
      if (err) throw err;
      if (api.debugger.status)
        console.log('STATUS: ' + res.statusCode);
      if (api.debugger.body)
        console.log('BODY: ' + JSON.stringify(res.body));
      api.lastResult = res.body;
      if (cb) cb(err, res.body);
    });
  },

  multiput: function(path, data, cb) {
    var api = this;

    if (api.debugger.border)
      console.log('====================');
    if (api.debugger.api)
      console.log('PUT: ' + path);
    if (api.accessToken)
      path += '?access_token=' + api.accessToken.id;

    needle.put(api.url(path), data, {accept: 'application/json', multipart: true}, function(err, res) {
      if (err) throw err;
      if (api.debugger.status)
        console.log('STATUS: ' + res.statusCode);
      if (api.debugger.body)
        console.log('BODY: ' + JSON.stringify(res.body));
      api.lastResult = res.body;
      if (cb) cb(err, res.body);
    });
  },

  delete: function(path, cb) {
    var api = this;

    if (api.debugger.border)
      console.log('====================');
    if (api.debugger.api)
      console.log('DELETE: ' + path);
    if (api.accessToken)
      path += '?access_token=' + api.accessToken.id;

    needle.delete(api.url(path), {accept: 'application/json'}, function(err, res) {
      if (err) throw err;
      if (api.debugger.status)
        console.log('STATUS: ' + res.statusCode);
      api.lastResult = res.body;
      if (cb) cb(err, res.body);
    });
  }
};

module.exports = HiwuApi;
