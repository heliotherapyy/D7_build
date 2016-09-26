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

var wish = function wish(user, q, body, res) {
  var userId = user.id;
  var userProjectId = body.userProjectId;
  var projectId = body.projectId;

  /* wishCount */

  var wishCount = 0;

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

  var wishData = void 0;
  if (userProjectId !== undefined) {
    wishData = function wishData() {
      return _models2.default.UserProject.where("id", userProjectId).fetch({ withRelated: "project" }).then(function (userProject) {
        if (userProject) {
          userProject = userProject.toJSON();
          projectId = userProject.projectId;
          wishCount = userProject.project.wishCount;
          return _models2.default.Wish.where({ userId: userId, projectId: projectId }).fetch();
        } else {
          throw "Invalid userProjectId";
        }
      });
    };
  } else if (projectId !== undefined) {
    wishData = function wishData() {
      return _models2.default.Project.where({ id: projectId }).fetch().then(function (project) {
        project = project.toJSON();
        wishCount = project.wishCount;
        return _models2.default.Wish.where({ userId: userId, projectId: projectId }).fetch();
      });
    };
  } else {
    console.error("Error: Invalid body.data");
  }

  wishData().then(function (wish) {
    if (wish) {
      wishCount -= 1;
      return new _models2.default.Wish({ id: wish.id }).destroy().catch(function (err) {
        return "Failed to destroy Wish table row: " + err;
      });
    } else {
      wishCount += 1;
      return new _models2.default.Wish({ userId: userId, projectId: projectId }).save().catch(function (err) {
        return "Failed to add new wish row: " + err;
      });
    }
  }).then(function () {
    new _models2.default.Project({ id: projectId }).save({ wishCount: wishCount });
  }).then(function () {
    return { projectId: projectId, wishCount: wishCount };
  }).then(function (data) {
    res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to store wish info in Wish Table in 'wish.js': ", err);
    res.status(500).end();
  });
};

exports.default = wish;
//# sourceMappingURL=wish.js.map
