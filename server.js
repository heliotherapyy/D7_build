"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _connectFlash = require("connect-flash");

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require("./db/config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); /* Get tools we need */

var port = process.env.PORT || 8080;

/* Set up express application */
app.use((0, _morgan2.default)("dev"));
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(__dirname + "/../client"));

/* Set up Passport */
app.use((0, _expressSession2.default)({ secret: "iloved7olived7iloved7" }));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

/* Set up Flash */
app.use((0, _connectFlash2.default)());

/* Routes */
app.use("/", _router2.default);
console.log("Applied router middleware");

/* Initialize Database */

_config2.default.resetDB().then(_config2.default.initDB());

/* Launch Server */
var server = app.listen(port, function () {
  console.log("Express listening on port ", port);
});
//# sourceMappingURL=server.js.map
