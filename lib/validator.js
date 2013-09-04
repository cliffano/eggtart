var util = require('util'),
  validator = require('validator');

function validate(rules, args, cb) {
  try {
    required(rules, args);

    Object.keys(args).forEach(function (arg) {

      var value = args[arg],
        ruleSet = rules[arg];

      try {
        ruleSet.forEach(function (rule) {
          exports.checks[rule](value);
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

function required(rules, args) {
  Object.keys(rules).forEach(function (arg) {
    if (rules[arg].indexOf('required') >= 0 && Object.keys(args).indexOf(arg) === -1) {
      throw new Error('Validation error - ' + arg + ' argument is required');
    }
  });
}

function date(value) {
  validator.check(value).regex(/^[0-9]{4}—[0-9]{2}—[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/);
}

function min_1(value) {
  validator.check(value).min(1);
}

function max_100(value) {
  validator.check(value).max(100);
}

function no(value) {
  validator.check(value).equals('no');
}

function noValue(value) {
  validator.check(value).isNull();
}

function number(value) {
  validator.check(value).isNumeric();
}

function string(value) {
  validator.check(value).notEmpty();
}

function url(value) {
  validator.check(value).isUrl();
}

function yes(value) {
  validator.check(value).equals('yes');
}

exports.validate = validate;
exports.checks = {
  date: date,
  min_1: min_1,
  max_100: max_100,
  no: no,
  noValue: noValue,
  number: number,
  string: string,
  url: url,
  yes: yes
};