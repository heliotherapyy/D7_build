"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch all projects details in 'wishCount' desc order from 'project' table */
/* Query: page */

var fetchRecommendedProjects = function fetchRecommendedProjects(user, q, res) {
  var userId = user.id;
  var page = q.page;

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

  _models2.default.Project.forge().orderBy("-wishCount").fetchPage({
    pageSize: 20,
    page: page,
    withRelated: ["user", "wishes"]
  }).then(function (projects) {
    projects = projects.toJSON();

    projects.forEach(function (project) {
      /* username, userPhoto */
      project.username = project.user.username;
      project.userPhoto = project.user.userPhoto;
      delete project.user;

      /* doneWish */
      project.doneWish = false;
      project.wishes.forEach(function (wish) {
        if (wish.userId === userId) {
          project.doneWish = true;
        }
      });
      delete project.wishes;
    });

    return projects;
  }).then(function (data) {
    res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read projects in 'fetchRecommendedProjects.js': ", err);
    res.status(500).end();
  });
};

exports.default = fetchRecommendedProjects;
//# sourceMappingURL=fetchRecommendedProjects.js.map
