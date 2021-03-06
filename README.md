<img align="right" src="https://raw.github.com/cliffano/eggtart/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://img.shields.io/travis/cliffano/eggtart.svg)](http://travis-ci.org/cliffano/eggtart)
[![Dependencies Status](https://img.shields.io/david/cliffano/eggtart.svg)](http://david-dm.org/cliffano/eggtart)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/eggtart.svg)](https://coveralls.io/r/cliffano/eggtart?branch=master)
[![Published Version](https://img.shields.io/npm/v/eggtart.svg)](http://www.npmjs.com/package/eggtart)
<br/>
[![npm Badge](https://nodei.co/npm/eggtart.png)](http://npmjs.org/package/eggtart)

Eggtart
-------

Eggtart is a [Delicious API](https://delicious.com/developers) node.js client.

This is handy when you want to use Delicious API service from a node.js application. Delicious API methods are available as Eggtart methods, e.g. https://api.delicious.com/v1/posts/recent?count=8 is mapped to eggtart.posts().recent({ count: 8 }, cb); .

Tested with Delicious API v1.

Installation
------------

    npm install [-g] eggtart

or as a dependency in package.json file:

    "dependencies": {
      "eggtart": "x.y.z"
    }

Usage
-----

    var Eggtart = require('eggtart'),
      eggtart = new Eggtart('username', 'password');

Get recent bookmarks:

    eggtart.posts().recent(function (err, result) {
      ...
    });

Get bookmarks for specific tags:

    eggtart.posts().get({ tag: 'sometag' }, function (err, result) {
      ...
    });

Rename tag on all posts:

    eggtart.tags().rename({ old: 'foo', new: 'bar' }, function (err, result) {
      ...
    })

Fetch tag bundles:

    eggtart.tagBundles().all(function (err, result) {
      ...
    });

Check out [Delicious API](https://github.com/SciDevs/delicious-api) documentation for a complete list of available methods.


Eggtart also has a set of CLI commands.

Take screenshots of bookmarks having at least one tag within the specified comma-separated tag list:

    eggtart -u user:pass screenshot --tags tag1,tag2,tag3

Delete bookmarks having at least a tag within the specified comma-separated tag list:

    eggtart -u user:pass delete --tags tag1,tag2,tag3

Colophon
--------

[Developer's Guide](http://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](http://cliffano.github.io/eggtart/complexity/plato/index.html)
* [Unit tests report](http://cliffano.github.io/eggtart/test/buster.out)
* [Test coverage report](http://cliffano.github.io/eggtart/coverage/buster-istanbul/lcov-report/lib/index.html)
* [Integration tests report](http://cliffano.github.io/eggtart/test-integration/cmdt.out)
* [API Documentation](http://cliffano.github.io/eggtart/doc/dox-foundation/index.html)
