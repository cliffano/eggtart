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
    _required(rules, args);

    Object.keys(args).forEach(function (arg) {

      var value = args[arg],
        ruleSet = rules[arg] || [];

      try {
        ruleSet.forEach(function (rule) {
          if (rule !== 'required') {
            exports.checks[rule](value);
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

function _required(rules, args) {
  Object.keys(rules).forEach(function (arg) {
    if (rules[arg].indexOf('required') >= 0 && Object.keys(args).indexOf(arg) === -1) {
      throw new Error('Validation error - ' + arg + ' argument is required');
    }
  });
}

function _date(value) {
  validator.check(value).regex(/^[0-9]{4}—[0-9]{2}—[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/);
}

function _min_1(value) {
  validator.check(value).min(1);
}

function _max_100(value) {
  validator.check(value).max(100);
}

function _no(value) {
  validator.check(value).equals('no');
}

function _novalue(value) {
  validator.check(value).isNull();
}

function _number(value) {
  validator.check(value).isNumeric();
}

function _string(value) {
  validator.check(value).notEmpty();
}

function _url(value) {
  validator.check(value).isUrl();
}

function _yes(value) {
  validator.check(value).equals('yes');
}

exports.validate = validate;
exports.checks = {
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