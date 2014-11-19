var Baker   = require('../lib/baker');
var buster  = require('buster-node');
var referee = require('referee');
var webshot = require('webshot');
var assert  = referee.assert;

buster.testCase('breaker - _iterPostsByTags', {
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