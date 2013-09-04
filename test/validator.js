var buster = require('buster'),
  validator = require('../lib/validator');

buster.testCase('validator - validate', {
  setUp: function () {
  }
});

buster.testCase('validator - checks', {
  'should not throw error when date format is correct': function (done) {
    try {
      validator.checks.date('2010—02—13T10:11:12Z');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'should throw error when date format is not correct': function (done) {
    try {
      validator.checks.date('TZTZ');
    } catch (e) {
      assert.equals(e.message, 'Invalid characters');
      done();
    }
  }
});