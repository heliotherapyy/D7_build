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

var _createNewProject = require("./createNewProject");

var _createNewProject2 = _interopRequireDefault(_createNewProject);

var _paymentCancel = require("./paymentCancel");

var _paymentCancel2 = _interopRequireDefault(_paymentCancel);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Create new post in 'post' table and if the req has new Project, create new project in 'project' table first */
/* Post Data: id, onDay, text, publicIds(array), newProject(object) */

var record = function record(user, q, body, res) {
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

  var id = body.id;
  var onDay = body.onDay;
  var text = body.text;
  var publicIds = body.publicIds;
  var newProject = body.newProject;

  var data = {
    userId: userId,
    projectId: undefined,
    userProjectId: id,
    day: onDay,
    text: text
  };

  /* If newProject is sent with record data, */
  /* create newProject first before record dayDetail */
  var createNewProjectPromise = function createNewProjectPromise() {
    return new _bluebird2.default(function (resolve, reject) {
      resolve();
    });
  };
  if ((id === undefined || id === null) && newProject) {
    createNewProjectPromise = function createNewProjectPromise() {
      var parsedNewProject = JSON.parse(newProject);
      return new _bluebird2.default.resolve((0, _createNewProject2.default)(user, q, parsedNewProject, null)).then(function (project) {
        return project;
      });
    };
  }

  /* Parse and rearrange 'publicIds' array */
  publicIds = JSON.parse(publicIds).map(function (publicId, index) {
    return { index: index, url: publicId };
  });

  createNewProjectPromise().then(function (newUserProject) {
    /* check if newProject is sent, and if so */
    /* assign 'newProject.id' to 'id' */
    if (newUserProject) {
      id = newUserProject.id;
      data.userProjectId = id;
    }
    return _models2.default.UserProject.where("id", id).fetch();
  }).then(function (userProject) {
    userProject = userProject.toJSON();
    data.projectId = userProject.projectId;
    return _models2.default.Post.forge().set(data).save().then(function (post) {
      return post;
    });
  }).then(function (post) {
    publicIds.forEach(function (publicId) {
      publicId.postId = post.id;
    });
    /* check if the length of publicIds array is 0 */
    /* if 0, do not execute knex.insert, or it will print out error like below */
    /* { Error:  - SQLITE_MISUSE: not an error at Error (native) errno: 21, code: 'SQLITE_MISUSE' } */
    if (publicIds.length < 1) {
      return post;
    } else {
      return _setConfig2.default.knex.insert(publicIds).into("postImage").then(function () {
        return post;
      }).catch(function (err) {
        return console.error("Error: Failed to store postImages in db in 'record.js': ", err);
      });
    }
  }).then(function (post) {
    // console.log("----------post here is 111", post);
    post = post.toJSON();
    return _models2.default.UserProject.where({ id: post.userProjectId }).fetch().then(function (userProject) {
      userProject = userProject.toJSON();
      var postDate = new Date(post.created_at).toJSON().slice(0, 10);
      var endDate = userProject.endAt;
      console.log("postdate and enddate", postDate, endDate);
      /* check if the date of posting is same with endDate of the userProject */
      /* and if so, update success col of userProject, from false to true */
      if (postDate === endDate) {
        return _models2.default.Transaction.where({ userProjectId: post.userProjectId }).fetch().then(function (transaction) {
          transaction = transaction.toJSON();
          var body = {
            customer_uid: transaction.customer_uid,
            merchant_uid: transaction.merchant_uid
          };
          return (0, _paymentCancel2.default)(null, null, body, null).then(function (answer) {
            post.doneCancelPayment = true;
          });
        }).then(function () {
          return new _models2.default.Transaction({ userProjectId: post.userProjectId }).save({ refund: true });
        }).then(function () {
          return new _models2.default.UserProject({ id: post.userProjectId }).save({ success: true });
        }).then(function () {
          return post;
        }).catch(function (err) {
          console.error("Error: Failed to change userProject S/U status in 'record.js': ", err);
          return err;
        });
      } else {
        return post;
      }
    });
  }).then(function (data) {
    res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to store dayDetail in db in 'record.js': ", err);
    res.status(500).end();
  });
};

exports.default = record;
//# sourceMappingURL=record.js.map
