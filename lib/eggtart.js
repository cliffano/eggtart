var fs = require('fs'),
  p = require('path'),
  req = require('bagofrequest'),
  xml2js = require('xml2js'),
  url = require('url'),
  util = require('util'),
  validator = require('./validator');

function Eggtart(username, password, opts) {
  opts = opts || {};

  this.version = opts.version || 'v1';
  this.wait = opts.wait || 1000; // mandatory wait to avoid forced throttling
  this.url = util.format('https://%s:%s@delicious.com/%s/',
    username,
    password,
    this.version);

  this._init();
}

Eggtart.prototype._init = function () {  
  var file = p.join(__dirname, '..', 'conf', this.version + '.json'),
    config = JSON.parse(fs.readFileSync(file)),
    self = this;

  Object.keys(config).forEach(function (method) {
    var subMethods = {};

    Object.keys(config[method]).forEach(function (subMethod) {
      subMethods[subMethod] = function (args, cb) {

        var rules = config[method][subMethod];
        validator.validate(rules, args, function (err) {
          if (err) {
            cb(err);
          } else {
            self._request(method + '/' + subMethod, args, cb);
          }
        });
      };
    });

    Eggtart.prototype[method] = function () {
      return subMethods;
    };
  });
};

Eggtart.prototype._request = function (endpoint, params, cb) {

  var parser = new xml2js.Parser(),
    self = this;

  function _success(result, cb) {
    parser.parseString(result.body, cb);
  }

  function _error(result, cb) {
    parser.parseString(result.body, function (err, result) {
      if (!err) {
        err = new Error(result.result.$.code);
      }
      cb(err);
    });
  }

  var opts = {
    queryStrings: params,
    handlers: {
      200: _success,
      401: _error,
      500: _error,
      999: _error
    }
  };

  setTimeout(function () {
    req.request('get', self.url + endpoint, opts, cb);
  }, this.wait);
};

module.exports = Eggtart;