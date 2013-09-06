var buster = require('buster'),
  Eggtart = require('../lib/eggtart'),
  fs = require('fs'),
  req = require('bagofrequest');

buster.testCase('eggtart - init', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should set method and sub method chained functions': function (done) {
    var config = {
      posts: {
        recent: {
          endpoint: 'posts/recent',
          args: {
            tag: ['string']
          }
        }
      }
    };
    this.mockFs.expects('readFileSync').once().returns(JSON.stringify(config));
    this.eggtart = new Eggtart('someusername', 'somepassword', { version: 'v2', wait: 1 });
    this.eggtart._request = function (endpoint, args, cb) { cb(); };
    assert.equals(typeof this.eggtart.posts().recent, 'function');
    this.eggtart.posts().recent({ tag: 'sometag' }, function (err, result) {
      assert.equals(err, undefined);
      done();
    });
  },
  'should set method and sub method chained functions, and propagate validation error': function (done) {
    var config = {
      posts: {
        recent: {
          endpoint: 'posts/recent',
          args: {
            tag: ['string']
          }
        }
      }
    };
    this.mockFs.expects('readFileSync').once().returns(JSON.stringify(config));
    this.eggtart = new Eggtart('someusername', 'somepassword');
    this.eggtart._request = function (endpoint, args, cb) { cb(); };
    assert.equals(typeof this.eggtart.posts().recent, 'function');
    this.eggtart.posts().recent({ tag: undefined }, function (err, result) {
      assert.equals(err.message, 'Validation error - arg: tag, value: undefined, desc: String is empty');
      done();
    });
  }
});

buster.testCase('eggtart - request', {
  setUp: function () {
    this.eggtart = new Eggtart('someusername', 'somepassword', { wait: 1 });
    this.eggtart._init = function () {};
  },
  'should parse result body as result when there is no error': function (done) {
    var mockRequest = function (method, url, opts, cb) {
      assert.equals(method, 'get');
      assert.equals(url, 'https://someusername:somepassword@api.delicious.com/v1/end/point');
      opts.handlers[200]({ statusCode: 200, body: '<result status="Success"/>' }, cb);
    };
    this.stub(req, 'request', mockRequest);
    this.eggtart._request('end/point', { somearg: 'somevalue' }, function (err, result) {
      assert.isNull(err);
      assert.equals(result.result.$.status, 'Success');
      done();
    });
  },
  'should parse error message and return it as part of callback when an error occurs': function (done) {
    var mockRequest = function (method, url, opts, cb) {
      assert.equals(method, 'get');
      assert.equals(url, 'https://someusername:somepassword@api.delicious.com/v1/end/point');
      opts.handlers[401]({ statusCode: 401, body: '<result code="Access denied"/>' }, cb);
    };
    this.stub(req, 'request', mockRequest);
    this.eggtart._request('end/point', { somearg: 'somevalue' }, function (err, result) {
      assert.equals(err.message, 'Access denied');
      done();
    });
  }
});