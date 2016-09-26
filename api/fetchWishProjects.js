"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch wishes from 'wish' table */
/* Query: none */

var fetchWishProjects = function fetchWishProjects(user, q, res) {
  var userId = user.id;

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

  /* data container to send */
  var result = void 0;

  /* Start point */
  _models2.default.Wish.where("userId", userId).orderBy("-created_at").fetchAll({ withRelated: ["user", "project"] }).then(function (wishes) {
    wishes = wishes.toJSON();
    result = [];

    wishes.forEach(function (wish) {
      var data = {};
      /* project id, title, description, image, wishCount, created_at, updated_at */
      var project = wish.project;
      data.id = project.id;
      data.title = project.title;
      data.description = project.description;
      data.image = project.image;
      data.wishCount = project.wishCount;
      data.created_at = data.createAt = project.created_at;
      data.updated_at = data.updatedAt = project.updated_at;

      /* userId, username */
      data.userId = wish.userId;
      data.username = wish.user.username;
      /* doneWish */
      data.doneWish = true;

      result.push(data);
    });
    return result;
  }).then(function (data) {
    return res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read projects in 'fetchRecommendedProjects.js': ", err);
    res.status(500).end();
  });
};

exports.default = fetchWishProjects;
//# sourceMappingURL=fetchWishProjects.js.map
