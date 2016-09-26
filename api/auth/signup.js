"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../../db/models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signup = function signup() {
  return function (req, res, next) {
    new _models2.default.User({ email: req.body.email, password: req.body.password, username: req.body.username }).save().then(function (user) {
      console.log(user);
      req.login(user, function (err) {
        if (!err) {
          return res.status(200).json({ message: "You have been successfully signed in." });
        } else {
          return res.status(401).json({ message: "You have been successfully signed up but there is something wrong logging in. Please try login again." });
        }
      });
    }).catch(function (err) {
      return res.status(401).json({ message: "This email is already registered. Please try another email." });
    });
  };
}; /* Passport Signup Handler */
exports.default = signup;
//# sourceMappingURL=signup.js.map
