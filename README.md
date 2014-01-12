<img align="right" src="https://raw.github.com/cliffano/eggtart/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://secure.travis-ci.org/cliffano/eggtart.png?branch=master)](http://travis-ci.org/cliffano/eggtart)
[![Dependencies Status](https://david-dm.org/cliffano/eggtart.png)](http://david-dm.org/cliffano/eggtart)
[![Coverage Status](https://coveralls.io/repos/cliffano/eggtart/badge.png?branch=master)](https://coveralls.io/r/cliffano/eggtart?branch=master)
[![Published Version](https://badge.fury.io/js/eggtart.png)](http://badge.fury.io/js/eggtart)
<br/>
[![npm Badge](https://nodei.co/npm/eggtart.png)](http://npmjs.org/package/eggtart)

Eggtart
-------

Eggtart is a [Delicious API](https://delicious.com/developers) node.js client.

This is handy when you want to use Delicious API service from a node.js application. Delicious API methods are available as Eggtart methods, e.g. https://api.delicious.com/v1/posts/recent?count=8 is mapped to eggtart.posts().recent({ count: 8 }, cb); .

Tested with Delicious API v1.

Installation
------------

    npm install eggtart

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

Check out [Delicious API](https://github.com/avos/delicious-api) documentation for a complete list of available methods.
