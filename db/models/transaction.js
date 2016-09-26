"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

var _userProject = require("./userProject");

var _userProject2 = _interopRequireDefault(_userProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Transaction = _setConfig2.default.Model.extend({
  tableName: "transaction",
  hasTimestamps: true,
  user: function user() {
    return this.belongsTo(_user2.default, "userId");
  },
  userProject: function userProject() {
    return this.belongsTo(_userProject2.default, "userProjectId");
  },
  defaults: {
    currency: "won",
    refund: false
  }
});

exports.default = Transaction;
//# sourceMappingURL=transaction.js.map
