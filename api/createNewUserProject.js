"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

var _payment = require("./payment");

var _payment2 = _interopRequireDefault(_payment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Create new project in 'userProject' tables */
/* Post Data: projectId, startAt, payment */

var createNewUserProject = function createNewUserProject(user, q, body, res) {
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

  /* If the payment is failed, delete userProject */
  /* by using ids below */
  var userProjectId = void 0;

  var projectId = body.projectId;
  var startAt = body.startAt;
  var payment = body.payment;


  var today = new Date();
  var startAtInObj = new Date(startAt);

  /* endAt = startAt + 6 days */
  var endAt = new Date(startAt);
  endAt.setDate(startAtInObj.getDate() + 6);
  endAt = endAt.toJSON().slice(0, 10);

  /* If startAt is today, assign 1 to 'onDay'. Otherwise, null */
  var onDay = null;
  if (today.toJSON().slice(0, 10) === startAtInObj.toJSON().slice(0, 10)) {
    onDay = 1;
  }

  /* Start Point */
  return _models2.default.UserProject.forge().set({
    userId: userId,
    projectId: projectId,
    startAt: startAt,
    endAt: endAt
  }).save().then(function (userProject) {
    userProjectId = userProject.id;

    var data = {
      id: userProject.id,
      onDay: onDay,
      endAt: endAt,
      donePayment: false
    };
    return data;
  }).then(function (data) {
    var postData = {
      userProjectId: data.id,
      endAt: data.endAt,
      payment: payment
    };

    /* Send payment Request through 'payment.js' */
    return (0, _payment2.default)(user, null, postData, null).then(function (answer) {
      data.donePayment = true;
      return data;
    });
  }).then(function (data) {
    /* Return data, if res === null or res === undefined */
    if (!res) {
      console.log("Methodical use: Return createNewUserProject Result: ", data);
      return data;
    } else {
      res.status(200).send(data);
    }
  }).catch(function (err) {
    /* If the process fails, including payment process, rollback */
    console.error("Error: Failed to store in 'project' or 'userProject' table: ", err);

    /* Delete project, userproject */
    new _models2.default.UserProject({ id: userProjectId }).destroy().then(function () {
      console.log("deleted false userproject info");
    }).catch(function (err) {
      console.error("Error: Failed to revert project and userproject");
    });

    /* Return err, if res === null or res === undefined */
    if (!res) {
      return data;
    } else {
      res.status(500).send({ donePayment: false }).end();
    }
  });
};

exports.default = createNewUserProject;
//# sourceMappingURL=createNewUserProject.js.map
