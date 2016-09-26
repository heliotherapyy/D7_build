"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _InitialData = require("./helpers/InitialData");

var _InitialData2 = _interopRequireDefault(_InitialData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Inserts Dummy Data into DB */

var initDB = function initDB() {

  /* Create User model data */
  new _models2.default.User({ username: "Lenny Kim",
    email: "idforcoding@gmail.com",
    password: "12345678"
  }).save().then(function (model) {
    return console.log("Created User model: ", model.attributes.username);
  });

  /* Create Project model data */
  _InitialData2.default.ProjectData.forEach(function (item) {
    new _models2.default.Project(item).save().then(function (model) {
      return console.log("Created Project model", model.attributes.title);
    });
  });

  /* Create Wish model data */
  _InitialData2.default.WishData.forEach(function (item) {
    new _models2.default.Wish(item).save().then(function (model) {
      return console.log("Created wish model", model.attributes.userId, model.attributes.projectId);
    }).catch(function (err) {
      return console.error("Error in WishData initialization", err);
    });
  });

  /* Create UserProject model data */
  _InitialData2.default.UserProjectData.forEach(function (item) {
    new _models2.default.UserProject(item).save().then(function (model) {
      return console.log("Created userProject model", model.attributes.id);
    });
  });

  /* Create Post model data */
  _InitialData2.default.PostData.forEach(function (item) {
    new _models2.default.Post(item).save().then(function (model) {
      return console.log("Created Post model", model.attributes.id);
    });
  });

  /* Create Like model data */
  _InitialData2.default.LikeData.forEach(function (item) {
    new _models2.default.Like(item).save().then(function (model) {
      return console.log("Created Like model", model.attributes.id);
    });
  });

  /* Create Report model data */
  _InitialData2.default.ReportData.forEach(function (item) {
    new _models2.default.Report(item).save().then(function (model) {
      return console.log("Created Report model", model.attributes.id);
    });
  });

  /* Create PostImage model data */
  _InitialData2.default.PostImageData.forEach(function (item) {
    new _models2.default.PostImage(item).save().then(function (model) {
      return console.log("Created PostImage model", model.attributes.id);
    });
  });

  /* Transaction model data */
  _InitialData2.default.TransactionData.forEach(function (item) {
    new _models2.default.Transaction(item).save().then(function (model) {
      return console.log("Created Transaction model", model.attributes.id);
    });
  });
};

exports.default = initDB;
//# sourceMappingURL=init.js.map
