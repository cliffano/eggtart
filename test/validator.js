var buster = require('buster'),
  validator = require('../lib/validator');

buster.testCase('validator - validate', {
  setUp: function () {
    this.args = {
      arg1: 'hello',
      arg2: 123
    };
  },
  'should pass error when a required arg is not provided': function (done) {
    var rules = {
      arg3: ['required']
    };
    validator.validate(rules, this.args, function (err) {
      assert.equals(err.message, 'Validation error - arg3 argument is required');
      done();
    });
  },
  'should pass error when an arg is invalid': function (done) {
    var rules = {
      arg1: ['required', 'url']
    };
    validator.validate(rules, this.args, function (err) {
      assert.equals(err.message, 'Validation error - arg: arg1, value: hello, desc: Invalid URL');
      done();
    });
  },
  'should not pass error when all args are correct': function (done) {
    var rules = {
    };
    validator.validate(rules, this.args, function (err) {
      assert.equals(err, undefined);
      done();
    });
  }
});

buster.testCase('validator - checks', {
  'date should not throw error when format is correct': function (done) {
    try {
      validator.checks.date('2010—02—13T10:11:12Z');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'date should throw error when format is not correct': function (done) {
    try {
      validator.checks.date('TZTZ');
    } catch (e) {
      assert.equals(e.message, 'Invalid characters');
      done();
    }
  },
  'min_1 should not throw error when value is more than or equal to min': function (done) {
    try {
      validator.checks.min_1(1);
      validator.checks.min_1(2);
      validator.checks.min_1(10000);
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'min_1 should throw error when value is less than min': function (done) {
    try {
      validator.checks.min_1(0);
    } catch (e) {
      assert.equals(e.message, 'Invalid number');
      done();
    }
  },
  'max_100 should not throw error when value is less than or equal to max': function (done) {
    try {
      validator.checks.max_100(100);
      validator.checks.max_100(99);
      validator.checks.max_100(0);
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'max_100 should throw error when value is less than min': function (done) {
    try {
      validator.checks.max_100(101);
    } catch (e) {
      assert.equals(e.message, 'Invalid number');
      done();
    }
  },
  'no should not throw error when value is no': function (done) {
    try {
      validator.checks.no('no');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'no should throw error when value is not no': function (done) {
    try {
      validator.checks.no('yes');
    } catch (e) {
      assert.equals(e.message, 'Not equal');
      done();
    }
  },
  'novalue should not throw error when value is null': function (done) {
    try {
      validator.checks.novalue(null);
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'novalue should throw error when value is not null': function (done) {
    try {
      validator.checks.novalue('foobar');
    } catch (e) {
      assert.equals(e.message, 'String is not empty');
      done();
    }
  },
  'number should not throw error when value is numeric': function (done) {
    try {
      validator.checks.number('1');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'number should throw error when value is not yes': function (done) {
    try {
      validator.checks.number('foobar');
    } catch (e) {
      assert.equals(e.message, 'Invalid number');
      done();
    }
  },
  'string should not throw error when value is string': function (done) {
    try {
      validator.checks.string('somestring');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'string should throw error when value is not string': function (done) {
    try {
      validator.checks.string();
    } catch (e) {
      assert.equals(e.message, 'String is empty');
      done();
    }
  },
  'url should not throw error when value is a URL': function (done) {
    try {
      validator.checks.url('http://somehost.com');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'url should throw error when value is not a URL': function (done) {
    try {
      validator.checks.url(123);
    } catch (e) {
      assert.equals(e.message, 'Invalid URL');
      done();
    }
  },
  'yes should not throw error when value is yes': function (done) {
    try {
      validator.checks.yes('yes');
      assert.isTrue(true);
      done();
    } catch (e) {
    }
  },
  'yes should throw error when value is not yes': function (done) {
    try {
      validator.checks.yes('no');
    } catch (e) {
      assert.equals(e.message, 'Not equal');
      done();
    }
  }
});