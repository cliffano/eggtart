var async   = require('async');
var webshot = require('webshot');

/**
 * class Baker
 *
 * @param {Object} eggtart: Eggtart instance to bake
 */
function Baker(eggtart) {
  this.eggtart = eggtart;
}

/**
 * Delete all posts with at least a tag in the specified array of tags.
 *
 * @param {Array} tags: Tags which posts are to be deleted
 * @param {Function} cb: standard cb(err, result) callback
 */
Baker.prototype.delete = function (tags, cb) {

  var self = this;

  function postCb(post, cb) {
    var url = post.$.href;
    console.log('%s - Deleted %s', 'success'.green, url);
    self.eggtart.posts().delete({ url: url }, cb);
  }

  this._iterPostsByTags(tags, postCb, cb);
};

/**
 * Take screenshot of all posts with at least a tag in the specified array of tags.
 * Each post will generate a screenshot file in PNG format.
 *
 * @param {Array} tags: Tags which posts are to be captured in a screenshot file
 * @param {Function} cb: standard cb(err, result) callback
 */
Baker.prototype.screenshot = function (tags, cb) {

  function postCb(post, cb) {

    var url   = post.$.href;
    var title = post.$.description;
    var file  = p.join(post._tag + '-' + title.replace(/\W/g, '') + '.png');

    webshot(url, file, { shotSize: {  width: 'all', height: 'all' } }, function (err) {
      if (err) {
        console.error('%s - %s %s', 'error'.red, err.message, file);
      } else {
        console.log('%s - Created %s', 'success'.green, file);
      }
      cb(err);
    });
  }

  this._iterPostsByTags(tags, postCb, cb);
};

// iterate through all posts within the specified tags
Baker.prototype._iterPostsByTags = function (tags, postCb, cb) {

  var self = this;

  function iterPosts(tag, cb) {

    console.log('* tag: %s', tag.cyan);

    self.eggtart.posts().recent({ tag: tag }, function (err, result) {

      if (err) {
        cb(err);
      } else if (result.posts) {
        result.posts.post.forEach(function (item) {
          item._tag = tag;
        });
        async.each(result.posts.post, postCb, cb);
      } else {
        console.log('%s - %s', 'warn'.yellow, 'No bookmark found');
        cb(err, result);
      }
    });
  }

  async.eachSeries(tags, iterPosts, cb);
};

module.exports = Baker;