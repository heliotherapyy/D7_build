"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch all projects from 'userProject' table */
/* Query: none */

var fetchOngoingProjects = function fetchOngoingProjects(user, q, res) {
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

  /* Start point */
  _models2.default.UserProject.where("userId", userId).orderBy("-created_at").fetchAll({ withRelated: ["project", "posts"] }).then(function (userProjects) {
    userProjects = userProjects.toJSON();
    var today = new Date();

    /* ongoing list */
    var result = [];

    userProjects.forEach(function (userProject) {
      /* tempData */
      var tempData = {
        id: userProject.id,
        title: userProject.project.title,
        description: userProject.project.description,
        image: userProject.project.image,
        success: userProject.project.success
      };

      /* Check Project status : doneToday /and/ count as total, success, fail */
      var startAt = new Date(userProject.startAt);
      /* Calculate diff, the difference between today and the start Date */
      var diff = Math.ceil((today.valueOf() - startAt.valueOf()) / (60 * 60 * 24 * 1000));
      if (!userProject.success && diff > 0 && diff <= 7) {
        tempData.onDay = diff;
        tempData.doneToday = false;
        userProject.posts.forEach(function (post) {
          if (post.day === diff) {
            tempData.doneToday = true;
          }
        });
        result.push(tempData);
      }
    });

    return result;
  }).then(function (data) {
    return res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read projects in 'fetchOngoingProjects.js'");
    res.status(500).end();
  });
};

exports.default = fetchOngoingProjects;
//# sourceMappingURL=fetchOngoingProjects.js.map
