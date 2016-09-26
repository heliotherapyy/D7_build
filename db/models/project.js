"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

var _post = require("./post");

var _post2 = _interopRequireDefault(_post);

var _userProject = require("./userProject");

var _userProject2 = _interopRequireDefault(_userProject);

var _wish = require("./wish");

var _wish2 = _interopRequireDefault(_wish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Project = _setConfig2.default.Model.extend({
  tableName: "project",
  hasTimestamps: true,
  defaults: {
    wishCount: 0,
    image: "wcban3touqae2pkobagf"
  },
  user: function user() {
    return this.belongsTo(_user2.default, "userId");
  },
  userProjects: function userProjects() {
    return this.hasMany(_userProject2.default, "projectId");
  },
  posts: function posts() {
    return this.hasMany(_post2.default, "projectId");
  },
  wishes: function wishes() {
    return this.hasMany(_wish2.default, "projectId");
  }
});

exports.default = Project;
//# sourceMappingURL=project.js.map
