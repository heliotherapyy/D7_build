"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

var _project = require("./project");

var _project2 = _interopRequireDefault(_project);

var _userProject = require("./userProject");

var _userProject2 = _interopRequireDefault(_userProject);

var _postImage = require("./postImage");

var _postImage2 = _interopRequireDefault(_postImage);

var _like = require("./like");

var _like2 = _interopRequireDefault(_like);

var _report = require("./report");

var _report2 = _interopRequireDefault(_report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Post = _setConfig2.default.Model.extend({
  tableName: "post",
  hasTimestamps: true,
  defaults: {
    likeCount: 0
  },
  user: function user() {
    return this.belongsTo(_user2.default, "userId");
  },
  userProject: function userProject() {
    return this.belongsTo(_userProject2.default, "userProjectId");
  },
  project: function project() {
    return this.belongsTo(_project2.default, "projectId");
  },
  postImages: function postImages() {
    return this.hasMany(_postImage2.default, "postId");
  },
  likes: function likes() {
    return this.hasMany(_like2.default, "postId");
  },
  reports: function reports() {
    return this.hasMany(_report2.default, "postId");
  }
});

exports.default = Post;
//# sourceMappingURL=post.js.map
