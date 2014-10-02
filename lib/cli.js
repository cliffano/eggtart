var bag     = require('bagofcli');
var Baker   = require('./baker');
var Eggtart = require('./eggtart');
var p       = require('path');

function _baker(args) {
  var userPass = (args.parent.userPass) ? args.parent.userPass.split(':') : '';
  var eggtart  = new Eggtart(userPass[0], userPass[1]);
  var baker    = new Baker(eggtart);
  return baker;
}

function _delete(args) {
  var tags  = args.tags ? args.tags.split(',') : [];
  _baker(args).delete(tags, bag.exit);
}

function _screenshot(args) {
  var tags  = args.tags ? args.tags.split(',') : [];
  _baker(args).screenshot(tags, bag.exit);
}

/**
 * Execute Nestor CLI.
 */
function exec() {

  var actions = {
    commands: {
      'delete': { action: _delete },
      screenshot: { action: _screenshot }
    }
  };

  bag.command(__dirname, actions);
}

exports.exec = exec;
