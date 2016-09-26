"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _models = require("./db/models");

var _models2 = _interopRequireDefault(_models);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _local = require("./helpers/passport_setup/local");

var _local2 = _interopRequireDefault(_local);

var _login = require("./api/auth/login");

var _login2 = _interopRequireDefault(_login);

var _signup = require("./api/auth/signup");

var _signup2 = _interopRequireDefault(_signup);

var _logout = require("./api/auth/logout");

var _logout2 = _interopRequireDefault(_logout);

var _checkLogin = require("./api/auth/checkLogin");

var _checkLogin2 = _interopRequireDefault(_checkLogin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/* Load api Handler Methods */
var handler = _api2.default.handler;
var fetchUser = _api2.default.fetchUser;
var fetchAllProjects = _api2.default.fetchAllProjects;
var fetchOngoingProjects = _api2.default.fetchOngoingProjects;
var fetchRecommendedProjects = _api2.default.fetchRecommendedProjects;
var fetchWishProjects = _api2.default.fetchWishProjects;
var fetchProjectDetail = _api2.default.fetchProjectDetail;
var fetchRecentPosts = _api2.default.fetchRecentPosts;
var fetchPopularPosts = _api2.default.fetchPopularPosts;
var fetchUserProjectDetail = _api2.default.fetchUserProjectDetail;
var createNewProject = _api2.default.createNewProject;
var createNewUserProject = _api2.default.createNewUserProject;
var record = _api2.default.record;
var like = _api2.default.like;
var report = _api2.default.report;
var wish = _api2.default.wish;
var user = _api2.default.user;
var payment = _api2.default.payment;
var paymentCancel = _api2.default.paymentCancel;

/* Authentication checking middleware */

var isAuthenticated = function isAuthenticated(req, res, next) {
  if (req.user) {
    console.log(">>>>>>>>>>>>", req.user);
    return next();
  } else {
    // res.redirect("/");
    res.status(401).json({ path: "/" });
  }
};

/* Passport import */


/* Passport Strategies */


/* Passport local setting */
(0, _local2.default)();

/* Passport Facebook setting */
// some code


/* Passport Google setting */
// some code


/* Passport Authentication APIs */


router.post("/api/signup", (0, _signup2.default)());
router.post("/api/login", (0, _login2.default)());
router.get("/api/logout", isAuthenticated, (0, _logout2.default)());
router.get("/api/checklogin", (0, _checkLogin2.default)());

/* Data save/fetch APIs */
router.get("/api/user", isAuthenticated, handler(fetchUser));
router.get("/api/posts/popular", isAuthenticated, handler(fetchPopularPosts));
router.get("/api/posts/recent", isAuthenticated, handler(fetchRecentPosts));
router.get("/api/userproject", isAuthenticated, handler(fetchUserProjectDetail));
router.get("/api/projects/all", isAuthenticated, handler(fetchAllProjects));
router.get("/api/projects/ongoing", isAuthenticated, handler(fetchOngoingProjects));
router.get("/api/projects/recommended", isAuthenticated, handler(fetchRecommendedProjects));
router.get("/api/projects/wish", isAuthenticated, handler(fetchWishProjects));
router.get("/api/project", isAuthenticated, handler(fetchProjectDetail));

router.post("/api/record", isAuthenticated, handler(record));
router.post("/api/newproject", isAuthenticated, handler(createNewProject));
router.post("/api/newuserproject", isAuthenticated, handler(createNewUserProject));
router.post("/api/like", isAuthenticated, handler(like));
router.post("/api/report", isAuthenticated, handler(report));
router.post("/api/wish", isAuthenticated, handler(wish));
router.post("/api/user", isAuthenticated, handler(user));

router.post("/api/payment", isAuthenticated, handler(payment));
router.post("/api/paymentcancel", isAuthenticated, handler(paymentCancel));

/* Rest */
router.get("*", function (req, res, next) {
  res.redirect("/");
});

exports.default = router;
//# sourceMappingURL=router.js.map
