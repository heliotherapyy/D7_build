"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch all post in 'created_at' desc order from 'post' table */
/* Query: page */

var fetchRecentPosts = function fetchRecentPosts(user, q, res) {
  var userId = user.id;
  var page = q.page;

  // Test code below
  // let userId;
  // if (user && user.id) {
  //   userId = user.id;
  // }
  // if (q && q.id) {
  //   userId = q.id;
  // } else {
  //   userId = 1;
  // }

  /* Start point */

  _models2.default.Post.forge().orderBy("-created_at").fetchPage({
    pageSize: 20,
    page: page,
    withRelated: ["user", "userProject", "postImages", "likes", "reports"]
  }).then(function (posts) {
    posts = posts.toJSON();

    /* Array of Promises to be 'Promise.all'ed */
    var postsPromiseArray = [];

    posts.forEach(function (post) {
      /* make thenable promise object */
      var postPromise = new _bluebird2.default(function (resolve, reject) {
        /* userId, username */
        post.username = post.user.username;
        post.userPhoto = post.user.photo;
        delete post.user;

        /* postId */
        // post.postId = post.id;

        /* userProjectId*/
        /* like */
        post.doneLike = false;
        post.likes.forEach(function (like) {
          if (like.userId === userId) {
            post.doneLike = true;
          }
        });
        delete post.likes;

        /* report */
        post.doneReport = false;
        post.reports.forEach(function (report) {
          if (report.userId === userId) {
            post.doneReport = true;
          }
        });
        delete post.reports;

        /* text, picture */
        var postImages = post.postImages;
        var newPostImages = [];
        postImages.forEach(function (postImage) {
          newPostImages[postImage.index] = postImage.url;
        });
        post.publicIds = newPostImages;
        delete post.postImages;

        /* created_at, updated_at */
        post.createdAt = post.created_at;
        post.updatedAt = post.updated_at;
        delete post.created_at;
        delete post.updated_at;

        /* project title, description */
        _models2.default.UserProject.where("id", post.userProjectId).fetch({ withRelated: ["project"] }).then(function (userProject) {
          userProject = userProject.toJSON();
          post.projectTitle = userProject.project.title;
          post.projectDescription = userProject.project.description;
        }).then(function () {
          delete post.userProject;
          resolve();
        }).catch(function (err) {
          console.error("Error: Failed to read userProject data in 'fetchRecentPosts.js': ", err);
          return err;
        });
      });
      postsPromiseArray.push(postPromise);
    });

    return _bluebird2.default.all(postsPromiseArray).then(function () {
      return posts;
    });
  }).then(function (data) {
    return res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read projects in 'fetchRecentPosts.js': ", err);
    res.status(500).end();
  });
};

exports.default = fetchRecentPosts;
//# sourceMappingURL=fetchRecentPosts.js.map
