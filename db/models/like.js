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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Like = _setConfig2.default.Model.extend({
  tableName: "like",
  hasTimestamps: true,
  user: function user() {
    return this.belongsTo(_user2.default, "userId");
  },
  post: function post() {
    return this.belongsTo(_post2.default, "postId");
  }
});

exports.default = Like;
//# sourceMappingURL=like.js.map
