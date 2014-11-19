var bag = require('bagofcli');
var Baker = require('../lib/baker');
var buster = require('buster-node');
var cli = require('../lib/cli');
var referee = require('referee');
var assert = referee.assert;

buster.testCase('cli - exec', {
  'should contain commands with actions': function (done) {
    var mockCommand = function (base, actions) {
      assert.defined(base);
      assert.defined(actions.commands.delete.action);
      assert.defined(actions.commands.screenshot.action);
      done();
    };
    this.mock({});
    this.stub(bag, 'command', mockCommand);
    cli.exec();
  }
});

buster.testCase('cli - delete', {
  setUp: function () {
    this.mock({});
  },
  'should contain delete command and delegate to baker delete when exec is called': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.delete.action({ tags: 'tag1,tag2', parent: {} });
    });
    this.stub(Baker.prototype, 'delete', function (tags, cb) {
      assert.equals(tags, ['tag1', 'tag2']);
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  },
  'should pass empty array when tags arg is not provided': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.delete.action({ parent: {} });
    });
    this.stub(Baker.prototype, 'delete', function (tags, cb) {
      assert.equals(tags, []);
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  }
});

buster.testCase('cli - screenshot', {
  setUp: function () {
    this.mock({});
  },
  'should contain screenshot command and delegate to baker screenshot when exec is called': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.screenshot.action({ tags: 'tag1,tag2', parent: { userPass: 'someusername:somepassword' } });
    });
    this.stub(Baker.prototype, 'screenshot', function (tags, cb) {
      assert.equals(tags, ['tag1', 'tag2']);
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  },
  'should pass empty array when tags arg is not provided': function (done) {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.screenshot.action({ parent: { userPass: 'someusername:somepassword' } });
    });
    this.stub(Baker.prototype, 'screenshot', function (tags, cb) {
      assert.equals(tags, []);
      assert.equals(typeof cb, 'function');
      done();
    });
    cli.exec();
  }
});