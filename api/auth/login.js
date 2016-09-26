"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var login = function login() {
  return function (req, res, next) {
    _passport2.default.authenticate("local", function (authErr, user, info) {
      if (authErr) {
        console.log(authErr);
        return next(authErr);
      }
      if (!user) {
        console.log(info);
        return res.status(401).json({ message: info.message });
      }
      return req.logIn(user, function (loginErr) {
        if (loginErr) {
          return res.status(401).json({ message: loginErr });
        } else {
          return res.status(200).json({
            message: "You have been successfully logged in."
          });
        }
      });
    })(req, res, next);
  };
}; /* Passport Login Handler */
exports.default = login;
//# sourceMappingURL=login.js.map
