var Baker      = require('../lib/baker');
var buster     = require('buster-node');
var proxyquire = require('proxyquire');
var referee    = require('referee');
var webshot    = require('webshot');
var assert     = referee.assert;

buster.testCase('baker - delete', {
  setUp: function () {
    this.mockConsole = this.mock(console);
  },
  'should delegate to eggtart delete api': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('%s - Deleted %s', 'success'.green, 'http://someurl');
    var mockEggtart = {
      posts: function () {
        return {
          delete: function (post, cb) {
            assert.equals(post.url, 'http://someurl');
            cb();
          }
        };
      }
    };
    var baker = new Baker(mockEggtart);
    baker._iterPostsByTags = function (tags, postCb, cb) {
      var post = {
        '$': {
          href: 'http://someurl'
        }
      };
      postCb(post, done);
    };
    baker.delete(['tag1'], done);
  }
});

buster.testCase('baker - screenshot', {
  setUp: function () {
    this.mockConsole = this.mock(console);
  },
  'should delegate to webshot to capture screenshot': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('%s - Created %s', 'success'.green, 'tag1-somedesc.png');
    var mockEggtart = {
      posts: function () {
        return {
          delete: function (post, cb) {
            assert.equals(post.url, 'http://someurl');
            cb();
          }
        };
      }
    };
    var mockWebshot = function (url, file, opts, cb) {
      assert.equals(url, 'http://someurl');
      assert.equals(file, 'tag1-somedesc.png');
      assert.defined(opts.shotSize);
      cb();
    };
    var Baker = proxyquire('../lib/baker', { webshot: mockWebshot });
    var baker = new Baker(mockEggtart);
    baker._iterPostsByTags = function (tags, postCb, cb) {
      var post = {
        '$': {
          href: 'http://someurl',
          description: 'somedesc'
        },
        _tag: 'tag1'
      };
      postCb(post, done);
    };
    baker.screenshot(['tag1'], done);
  },
  'should log error message when an error occurred': function (done) {
    this.mockConsole.expects('error').once().withExactArgs('%s - %s %s', 'error'.red, 'some error', 'tag1-somedesc.png');
    var mockEggtart = {
      posts: function () {
        return {
          delete: function (post, cb) {
            assert.equals(post.url, 'http://someurl');
            cb();
          }
        };
      }
    };
    var mockWebshot = function (url, file, opts, cb) {
      assert.equals(url, 'http://someurl');
      assert.equals(file, 'tag1-somedesc.png');
      assert.defined(opts.shotSize);
      cb(new Error('some error'));
    };
    var Baker = proxyquire('../lib/baker', { webshot: mockWebshot });
    var baker = new Baker(mockEggtart);
    baker._iterPostsByTags = function (tags, postCb, cb) {
      var post = {
        '$': {
          href: 'http://someurl',
          description: 'somedesc'
        },
        _tag: 'tag1'
      };
      postCb(post, done);
    };
    baker.screenshot(['tag1'], done);
  }
});

buster.testCase('baker - _iterPostsByTags', {
  setUp: function () {
    this.mockConsole = this.mock(console);
  },
  'should pass error to callback when error occurred while retrieving posts': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('* tag: %s', 'tag1'.cyan);
    var mockEggtart = {
      posts: function () {
        return {
          recent: function (opts, cb) {
            cb(new Error('some error'));
          }
        };
      }
    };
    var baker = new Baker(mockEggtart);
    baker._iterPostsByTags(['tag1', 'tag2'], null, function (err, result) {
      assert.equals(err.message, 'some error');
      done();
    });
  },
  'should process each post when posts are found': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('* tag: %s', 'tag1'.cyan);
    var mockEggtart = {
      posts: function () {
        return {
          recent: function (opts, cb) {
            cb(null, { posts: { post: [{}] }});
          }
        };
      }
    };
    var postCb = function (post, cb) {
      assert.equals(post._tag, 'tag1');
      cb();
    };
    var baker = new Baker(mockEggtart);
    baker._iterPostsByTags(['tag1'], postCb, function (err, result) {
      assert.equals(err, undefined);
      done();
    });
  },
  'should log message when no posts found': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('* tag: %s', 'tag1'.cyan);
    this.mockConsole.expects('log').once().withExactArgs('* tag: %s', 'tag2'.cyan);
    this.mockConsole.expects('log').twice().withExactArgs('%s - %s', 'warn'.yellow, 'No bookmark found');
    var mockEggtart = {
      posts: function () {
        return {
          recent: function (opts, cb) {
            cb(null, {});
          }
        };
      }
    };
    var baker = new Baker(mockEggtart);
    baker._iterPostsByTags(['tag1', 'tag2'], null, function (err, result) {
      assert.equals(err, undefined);
      done();
    });
  }
});