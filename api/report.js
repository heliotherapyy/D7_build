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

/* Create new report in 'report' table */
/* Post Data: postId, description */

var report = function report(user, q, body, res) {
  var userId = user.id;
  var postId = body.postId;
  var description = body.description;

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

  /* Start point */

  _models2.default.Post.where("id", postId).fetch().then(function (post) {
    if (post) {
      return new _models2.default.Report({ userId: userId, postId: postId, description: description }).save();
    } else {
      /* If there is no matching post, throw error */
      throw "Invalid postId";
    }
  }).then(function (data) {
    res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to store like info in Report Table in 'report.js': ", err);
    res.status(500).end();
  });
};

exports.default = report;
//# sourceMappingURL=report.js.map
