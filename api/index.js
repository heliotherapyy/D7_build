"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchUser = require("./fetchUser");

var _fetchUser2 = _interopRequireDefault(_fetchUser);

var _fetchAllProjects = require("./fetchAllProjects");

var _fetchAllProjects2 = _interopRequireDefault(_fetchAllProjects);

var _fetchOngoingProjects = require("./fetchOngoingProjects");

var _fetchOngoingProjects2 = _interopRequireDefault(_fetchOngoingProjects);

var _fetchRecommendedProjects = require("./fetchRecommendedProjects");

var _fetchRecommendedProjects2 = _interopRequireDefault(_fetchRecommendedProjects);

var _fetchWishProjects = require("./fetchWishProjects");

var _fetchWishProjects2 = _interopRequireDefault(_fetchWishProjects);

var _fetchProjectDetail = require("./fetchProjectDetail");

var _fetchProjectDetail2 = _interopRequireDefault(_fetchProjectDetail);

var _fetchUserProjectDetail = require("./fetchUserProjectDetail");

var _fetchUserProjectDetail2 = _interopRequireDefault(_fetchUserProjectDetail);

var _fetchRecentPosts = require("./fetchRecentPosts");

var _fetchRecentPosts2 = _interopRequireDefault(_fetchRecentPosts);

var _fetchPopularPosts = require("./fetchPopularPosts");

var _fetchPopularPosts2 = _interopRequireDefault(_fetchPopularPosts);

var _createNewProject = require("./createNewProject");

var _createNewProject2 = _interopRequireDefault(_createNewProject);

var _createNewUserProject = require("./createNewUserProject");

var _createNewUserProject2 = _interopRequireDefault(_createNewUserProject);

var _record = require("./record");

var _record2 = _interopRequireDefault(_record);

var _like = require("./like");

var _like2 = _interopRequireDefault(_like);

var _report = require("./report");

var _report2 = _interopRequireDefault(_report);

var _wish = require("./wish");

var _wish2 = _interopRequireDefault(_wish);

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

var _payment = require("./payment");

var _payment2 = _interopRequireDefault(_payment);

var _paymentCancel = require("./paymentCancel");

var _paymentCancel2 = _interopRequireDefault(_paymentCancel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* handler */
/* data fetching */
var handler = function handler(apiMethod) {
  return function (req, res, next) {
    var url = req.path;
    var query = req.query;
    var body = req.body;
    var user = req.user;

    /* check the req's method by extract the keys of Object 'data' */
    if (Object.keys(body).length === 0) {
      console.log("Request GET for ", url, query, "by", user);
      apiMethod(user, query, res);
    } else {
      console.log("Request POST to ", url, query, "to write", body, "by", user);
      apiMethod(user, query, body, res);
    }
  };
};

/* data create */
exports.default = {
  handler: handler,
  fetchUser: _fetchUser2.default,
  fetchAllProjects: _fetchAllProjects2.default,
  fetchOngoingProjects: _fetchOngoingProjects2.default,
  fetchRecommendedProjects: _fetchRecommendedProjects2.default,
  fetchWishProjects: _fetchWishProjects2.default,
  fetchProjectDetail: _fetchProjectDetail2.default,
  fetchRecentPosts: _fetchRecentPosts2.default,
  fetchPopularPosts: _fetchPopularPosts2.default,
  fetchUserProjectDetail: _fetchUserProjectDetail2.default,
  createNewProject: _createNewProject2.default,
  createNewUserProject: _createNewUserProject2.default,
  record: _record2.default,
  like: _like2.default,
  report: _report2.default,
  wish: _wish2.default,
  user: _user2.default,
  payment: _payment2.default,
  paymentCancel: _paymentCancel2.default
};
//# sourceMappingURL=index.js.map
