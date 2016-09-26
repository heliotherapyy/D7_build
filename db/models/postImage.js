"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _post = require("./post");

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PostImage = _setConfig2.default.Model.extend({
  tableName: "postImage",
  hasTimestamps: true,
  post: function post() {
    return this.belongsTo(_post2.default, "postId");
  },
  defaults: {
    index: 0
  }
});

exports.default = PostImage;
//# sourceMappingURL=postImage.js.map
