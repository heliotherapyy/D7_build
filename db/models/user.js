"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _project = require("./project");

var _project2 = _interopRequireDefault(_project);

var _userProject = require("./userProject");

var _userProject2 = _interopRequireDefault(_userProject);

var _post = require("./post");

var _post2 = _interopRequireDefault(_post);

var _wish = require("./wish");

var _wish2 = _interopRequireDefault(_wish);

var _like = require("./like");

var _like2 = _interopRequireDefault(_like);

var _report = require("./report");

var _report2 = _interopRequireDefault(_report);

var _transaction = require("./transaction");

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _setConfig2.default.Model.extend({
  tableName: "user",
  hasTimestamps: true,
  initialize: function initialize() {
    this.on("created", this.hashPW, this);
  },
  hashPW: function hashPW(model, attrs, options) {
    var salt = _bcryptjs2.default.genSaltSync(10);
    var hash = _bcryptjs2.default.hashSync(model.attributes.password, salt);
    model.set("password", hash).save();
  },
  defaults: {
    photo: "a6jnokqrjo9ptrsl1vgv"
  },
  projects: function projects() {
    return this.hasMany(_project2.default, "userId");
  },
  userProjects: function userProjects() {
    return this.hasMany(_userProject2.default, "userId");
  },
  posts: function posts() {
    return this.hasMany(_post2.default, "userId");
  },
  wishes: function wishes() {
    return this.hasMany(_wish2.default, "userId");
  },
  likes: function likes() {
    return this.hasMany(_like2.default, "userId");
  },
  reports: function reports() {
    return this.hasMany(_report2.default, "userId");
  },
  transactions: function transactions() {
    return this.hasMany(_transaction2.default, "userId");
  }
});

exports.default = User;
//# sourceMappingURL=user.js.map
