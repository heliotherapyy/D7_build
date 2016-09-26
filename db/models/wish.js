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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Wish = _setConfig2.default.Model.extend({
  tableName: "Wish",
  hasTimestamps: true,
  user: function user() {
    return this.belongsTo(_user2.default, "userId");
  },
  project: function project() {
    return this.belongsTo(_project2.default, "projectId");
  }
});

exports.default = Wish;
//# sourceMappingURL=wish.js.map
