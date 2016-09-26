"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("./setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _init = require("./init");

var _init2 = _interopRequireDefault(_init);

var _reset = require("./reset");

var _reset2 = _interopRequireDefault(_reset);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  db: _setConfig2.default,
  initDB: _bluebird2.default.promisify(_init2.default),
  resetDB: _bluebird2.default.promisify(_reset2.default)
};
//# sourceMappingURL=index.js.map
