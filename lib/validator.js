var util = require('util'),
  validator = require('validator');

/**
 * Validate arguments against a set of rules.
 *
 * @param {Object} rules: argument name-ruleset pair, ruleset is an array of check functions
 * @param {Object} args: argument name-value pair
 * @param {Function} cb: standard cb(err, result) callback
 */
function validate(rules, args, cb) {
  try {
    _known(rules, args);
    _required(rules, args);

    Object.keys(args).forEach(function (arg) {

      var value = args[arg],
        ruleSet = rules[arg];

      try {
        ruleSet.forEach(function (rule) {
          if (rule !== 'required') {
            exports.checks[rule](value || '');
          }
        });
      } catch (e) {
        throw new Error(util.format(
          'Validation error - arg: %s, value: %s, desc: %s',
          arg, value, e.message));
      }
    });
    cb();
  } catch (e) {
    cb(e);
  }
}

function _comma(value) {
  if (validator.equals(value, 'comma') === false) {
    throw new Error('Value should be \'comma\'');
  }
}

function _known(rules, args) {
  Object.keys(args).forEach(function (arg) {
    if (Object.keys(rules).indexOf(arg) === -1) {
      throw new Error('Validation error - ' + arg + ' argument is unknown');
    }
  });
}

function _required(rules, args) {
  Object.keys(rules).forEach(function (arg) {
    if (rules[arg].indexOf('required') >= 0 && Object.keys(args).indexOf(arg) === -1) {
      throw new Error('Validation error - ' + arg + ' argument is required');
    }
  });
}

function _date(value) {
  if (validator.matches(value, /^[0-9]{4}—[0-9]{2}—[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/) === false) {
    throw new Error('Invalid date');
  }
}

function _min_1(value) {
  if (validator.equals((value >= 1) + '', 'false')) {
    throw new Error('Value must be greater than or equal to 1');
  }
}

function _max_100(value) {
  if (validator.equals((value <= 100) + '', 'false')) {
    throw new Error('Value must be less than or equal to 100');
  }
}

function _no(value) {
  if (validator.equals(value, 'no') === false) {
    throw new Error('Value should be \'no\'');
  }
}

function _novalue(value) {
  if (validator.equals((value === null) + '', 'false')) {
    throw new Error('Value must be a null');
  }
}

function _number(value) {
  if (validator.isNumeric(value + '') === false) {
    throw new Error('Invalid number');
  }
}

function _string(value) {
  if (validator.isNull(value) === true || validator.equals(value, '') === true) {
    throw new Error('Value should be a non-empty string');
  }
}

function _url(value) {
  if (validator.isURL(value + '') === false) {
    throw new Error('Invalid URL');
  }
}

function _yes(value) {
  if (validator.equals(value, 'yes') === false) {
    throw new Error('Value should be \'yes\'');
  }
}

exports.validate = validate;
exports.checks = {
  comma: _comma,
  date: _date,
  min_1: _min_1,
  max_100: _max_100,
  no: _no,
  novalue: _novalue,
  number: _number,
  string: _string,
  url: _url,
  yes: _yes
};
