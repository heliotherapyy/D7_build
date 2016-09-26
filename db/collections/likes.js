"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("../config/setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Likes = new _setConfig2.default.Collection();

Likes.model = _models2.default.Like;

exports.default = Likes;
//# sourceMappingURL=likes.js.map
