"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _knex = require("knex");

var _knex2 = _interopRequireDefault(_knex);

var _bookshelf = require("bookshelf");

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _bookshelf2.default)((0, _knex2.default)({
  client: "sqlite3",
  connection: {
    filename: _path2.default.join(__dirname, "d7.sqlite")
  },
  useNullAsDefault: true
}));

/* Inject plugin into bookshelf */
db.plugin("pagination");

exports.default = db;
//# sourceMappingURL=setConfig.js.map
