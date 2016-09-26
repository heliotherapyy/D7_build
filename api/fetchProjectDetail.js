"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch project details from 'project' table */
/* Query: page */

var fetchProjectDetail = function fetchProjectDetail(user, q, res) {
  var userId = user.id;
  var projectId = q.projectId;

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

  /* Data container to be sent */

  var result = {};

  /* Start point */
  _models2.default.Project.where("id", projectId).fetch({ withRelated: ["user"] }).then(function (project) {
    project = project.toJSON();

    /* project id, title, description, image, wishCount */
    result.projectId = project.id;
    result.projectTitle = project.title;
    result.projectDescription = project.description;
    result.projectImage = project.image;
    result.wishCount = project.wishCount;

    /* username, userId, photo */
    result.userId = project.user.id;
    result.username = project.user.username;
    result.userPhoto = project.user.photo;

    /* wishcount */
    result.wishCount = project.wishCount;
  }).then(function () {
    /* Fetch posts by projectId */
    /* posts + doneLike */
    return _models2.default.Post.where({ projectId: projectId }).orderBy("-created_at").fetchAll({ withRelated: ["user", "postImages", "likes", "reports"] });
  }).then(function (posts) {
    posts = posts.toJSON();
    result.posts = posts;
    if (!posts) {
      posts = [];
    }

    /* Array of Promises to be 'Promise.all'ed */
    var postsPromiseArray = [];

    posts.forEach(function (post) {
      /* make thenable promise object */
      var postPromise = new Promise(function (resolve, reject) {
        /* userId, username */
        post.username = post.user.username;
        post.userPhoto = post.user.photo;
        delete post.user;

        /* postId */
        // post.postId = post.id;

        /* userProjectId*/
        /* doneLike */
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

        /* created_at */
        post.createdAt = post.created_at;
        delete post.created_at;

        /* project title, description */
        _models2.default.UserProject.where("id", post.userProjectId).fetch({ withRelated: ["project"] }).then(function (userProject) {
          userProject = userProject.toJSON();
          post.projectTitle = userProject.project.title;
          post.projectDescription = userProject.project.description;
        }).then(function () {
          delete post.userProject;
          resolve();
        }).catch(function (err) {
          console.error("Error: Failed to read userProject data in fetchAllPosts: ", err);
          return err;
        });
      });
      postsPromiseArray.push(postPromise);
    });

    return Promise.all(postsPromiseArray).then(function () {
      return posts;
    });
  }).then(function () {
    /* doneWish */
    result.doneWish = false;
    return _models2.default.Wish.where({ userId: userId, projectId: result.projectId }).fetch().then(function (wish) {
      if (wish) {
        result.doneWish = true;
      }
    }).catch(function (err) {
      return "Failed to print doneWish: " + err;
    });
  }).then(function () {
    return result;
  }).then(function (data) {
    return res.status(200).send(data);
  }).catch(function (err) {
    console.error("Error: Failed to read projects in 'fetchAllPosts.js': ", err);
    res.status(500).end();
  });
};

exports.default = fetchProjectDetail;
//# sourceMappingURL=fetchProjectDetail.js.map
