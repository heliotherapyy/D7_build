"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

var _setConfig = require("../db/config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Create new like in 'like' table */
/* Post Data: postId */

var like = function like(user, q, body, res) {
  var userId = user.id;
  var postId = body.postId;

  // Test code below
  // let userId;
  // if (user && user.id) {
  //   userId = user.id;
  // }
  // if (q && q.id) {
  //   userId = q.id;
  // } else {
  //   userId = 1;
  // }

  /* likeCount */
  var likeCount = 0;

  /* Start Point */
  _models2.default.Post.where("id", postId).fetch().then(function (post) {
    if (post) {
      post = post.toJSON();
      likeCount = post.likeCount;

      return _models2.default.Like.where({ userId: userId, postId: postId }).fetch();
    } else {
      /* throw error if postId is invalid */
      throw "Invalid postId";
    }
  }).then(function (like) {
    if (like) {
      likeCount -= 1;
      return new _models2.default.Like({ id: like.id }).destroy().catch(function (err) {
        return "Failed to destroy like table row: " + err;
      });
    } else {
      likeCount += 1;
      return new _models2.default.Like({ userId: userId, postId: postId }).save().catch(function (err) {
        return "Failed to add new like row: " + err;
      });
    }
  }).then(function () {
    new _models2.default.Post({ id: postId }).save({ likeCount: likeCount });
  }).then(function () {
    return { postId: postId, likeCount: likeCount };
  }).then(function (data) {
    res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to store like info in Like Table in 'like.js': ", err);
    res.status(500).end();
  });
};

exports.default = like;
//# sourceMappingURL=like.js.map
