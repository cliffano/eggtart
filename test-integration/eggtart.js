var buster = require('buster-node'),
  Eggtart = require('../lib/eggtart'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('eggtart - v1', {
  setUp: function () {
    this.timeout = 5000;
  },
  'should give error when username and password are invalid': function (done) {
    var eggtart = new Eggtart('someinexistinguser', 'someinexistingpassword', { version: 'v1' });
    eggtart.posts().get({ tag: 'nodejs' }, function (err, result) {
      assert.equals(err.message, 'access denied');
      done();
    });
  }
});
