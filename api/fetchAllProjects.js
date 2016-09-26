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

var fetchAllProjects = function fetchAllProjects(user, q, res) {
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

  var today = new Date();

  _models2.default.UserProject.where("userId", userId).fetchAll({ withRelated: ["project", "posts"] }).then(function (userProjects) {
    var result = {
      waiting: [],
      onGoing: [],
      complete: []
    };

    userProjects.forEach(function (userProject) {
      userProject = userProject.toJSON();
      var data = {
        id: userProject.id,
        title: userProject.project.title,
        description: userProject.project.description,
        image: userProject.project.image,
        startAt: userProject.startAt,
        endAt: userProject.endAt,
        success: userProject.success
      };

      /* Check Project status */
      var startAt = new Date(userProject.startAt);
      /* Calculate diff, the difference between today and the start Date */
      var diff = today.valueOf() - startAt.valueOf();
      diff = Math.ceil(diff / (60 * 60 * 24 * 1000));
      if (diff > 0 && diff <= 7 && !data.success) {
        data.onDay = diff;
        data.doneToday = false;
        userProject.posts.forEach(function (item) {
          if (item.day === diff) {
            data.doneToday = true;
          }
        });
        result.onGoing.push(data);
      } else if (diff <= 0) {
        data.onDay = diff;
        result.waiting.push(data);
      } else {
        result.complete.push(data);
      }
    });

    return result;
  }).then(function (data) {
    res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read projects in 'fetchAllProjects.js': ", err);
    res.status(500).end();
  });
};

exports.default = fetchAllProjects;
//# sourceMappingURL=fetchAllProjects.js.map
