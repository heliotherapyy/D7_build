"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch user details in from 'user' table */
/* Query: none */

var fetchUser = function fetchUser(user, q, res) {
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
  _models2.default.User.where({ id: userId }).fetch({ withRelated: ["userProjects", "transactions"] }).then(function (user) {
    user = user.toJSON();

    /* userProject counts */
    var projectCountData = {
      success: 0,
      fail: 0,
      ongoing: 0,
      waiting: 0,
      total: 0
    };

    var today = new Date(new Date().toJSON().slice(0, 10));
    user.userProjects.forEach(function (project) {
      projectCountData.total++;
      if (project.success) {
        projectCountData.success++;
      } else {
        var startAt = new Date(project.startAt);
        var diff = today.valueOf() - startAt.valueOf();
        diff = Math.ceil(diff / (60 * 60 * 24 * 1000));
        console.log("diff is ", diff);
        if (diff > 0 && diff <= 7) {
          projectCountData.ongoing++;
        } else if (diff > 7) {
          projectCountData.fail++;
        } else {
          projectCountData.waiting++;
        }
      }
    });
    user.userProjects = projectCountData;

    /* userPhoto */
    user.userPhoto = user.photo;
    delete user.photo;

    /* password -> delete */
    delete user.password;

    /* Transaction data */
    var transactionData = [];
    /* Array of Promises to be 'Promise.all'ed */
    var transactionPromiseArray = [];

    // user.transaction = transactionData;
    user.transactions.sort(function (a, b) {
      var aSec = new Date(a.paymentDue).valueOf();
      var bSec = new Date(b.paymentDue).valueOf();
      return bSec - aSec;
    });

    user.transactions.forEach(function (trans) {
      /* Each transaction datum is storedin transData and pushed to 'transactionData' */
      var transData = {};
      var dueDate = new Date(trans.paymentDue);
      /* diff is the difference between today and the payment due date */
      var diff = dueDate.valueOf() - today.valueOf();
      if (diff < 0) {
        var transPromise = new _bluebird2.default(function (resolve, reject) {
          transData.date = dueDate.toJSON().slice(0, 10);
          transData.amount = trans.amount;
          transData.status = "paid";
          transData.currency = trans.currency;
          transData.projectTitle = undefined;
          transData.id = trans.id;
          console.log("transdata is ", transData);

          /* project title */
          /* Fetch userProject details from 'userProject' table */
          _models2.default.UserProject.where("id", trans.userProjectId).fetch({ withRelated: ["project"] }).then(function (userProject) {
            userProject = userProject.toJSON();
            transData.projectTitle = userProject.project.title;
            if (userProject.success) {
              transData.status = "refunded";
            }
            transactionData.push(transData);
            resolve();
          }).catch(function (err) {
            console.error("Error: Failed to read userProject data in 'fetchUser.js': ", err);
            resolve();
          });
        });
        transactionPromiseArray.push(transPromise);
      }
    });

    return _bluebird2.default.all(transactionPromiseArray).then(function () {
      user.transactions = transactionData;
      return user;
    });
  }).then(function (data) {
    return res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read user profile in 'fetchUser.js': ", err);
  });
};

exports.default = fetchUser;
//# sourceMappingURL=fetchUser.js.map
