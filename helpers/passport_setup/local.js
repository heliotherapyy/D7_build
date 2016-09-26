"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _models = require("../../db/models");

var _models2 = _interopRequireDefault(_models);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Passport local setting */

var localSetup = function localSetup() {
  _passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
  });
  _passport2.default.deserializeUser(function (id, done) {
    _models2.default.User.forge().where({ id: id }).fetch({ require: true }).then(function (user) {
      return done(null, user.toJSON());
    }).catch(function (err) {
      return done(err, false);
    });
  });
  _passport2.default.use(new _passportLocal2.default({
    usernameField: "email",
    passwordField: "password"
  }, function (email, password, done) {
    _models2.default.User.forge().where({ email: email }).fetch({ require: true }).then(function (user) {
      user = user.toJSON();
      if (_bcryptjs2.default.compareSync(password, user.password)) {
        done(null, user);
      } else {
        done(null, false, { message: "Incorrect password." });
      }
    }).catch(function (err) {
      done(null, false, { message: "Incorrect username" });
    });
  }));
};

exports.default = localSetup;
//# sourceMappingURL=local.js.map
