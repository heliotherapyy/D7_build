"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _post = require("./post");

var _post2 = _interopRequireDefault(_post);

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

var _project = require("./project");

var _project2 = _interopRequireDefault(_project);

var _transaction = require("./transaction");

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserProject = _setConfig2.default.Model.extend({
  tableName: "userProject",
  hasTimestamps: true,
  defaults: {
    success: false
  },
  user: function user() {
    return this.belongsTo(_user2.default, "userId");
  },
  project: function project() {
    return this.belongsTo(_project2.default, "projectId");
  },
  posts: function posts() {
    return this.hasMany(_post2.default, "userProjectId");
  },
  transaction: function transaction() {
    return this.hasOne(_transaction2.default, "userProjectId");
  }
});

exports.default = UserProject;
//# sourceMappingURL=userProject.js.map
