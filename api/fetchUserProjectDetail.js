"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Fetch userProject details from 'userProject' table */
/* Query: userProjectId */

var fetchUserProjectDetail = function fetchUserProjectDetail(user, q, res) {
  var userId = user.id;
  var userProjectId = q.userProjectId;

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

  /* data container to send */

  var result = {};

  /* Start point */
  _models2.default.UserProject.where("id", userProjectId).fetch({ withRelated: ["user", "project", "posts", "transaction"] }).then(function (userProject) {
    userProject = userProject.toJSON();

    /* userProject id */
    result.userProjectId = userProject.id;

    /* project id, title, description, wishCount */
    result.projectId = userProject.project.id;
    result.projectTitle = userProject.project.title;
    result.projectDescription = userProject.project.description;
    result.wishCount = userProject.project.wishCount;

    /* username, userId, photo */
    result.userId = userProject.user.id;
    result.username = userProject.user.username;
    result.userPhoto = userProject.user.photo;

    /* startAt, endAt */
    result.startAt = userProject.startAt;
    result.endAt = userProject.endAt;

    /* status : ongoing(+doneToday), waiting, complete /and/ onDay */
    if (userProject.success) {
      /* success case */
      result.status = "success";
    } else {
      (function () {
        /* fail, ongoing, waiting case */
        var today = new Date();
        var startAt = new Date(userProject.startAt);
        var diff = today.valueOf() - startAt.valueOf();
        diff = Math.ceil(diff / (60 * 60 * 24 * 1000));
        if (diff > 0 && diff <= 7) {
          result.status = "ongoing";
          result.onDay = diff;
          result.doneToday = false;
          userProject.posts.forEach(function (item) {
            if (item.day === diff) {
              result.doneToday = true;
            }
          });
        } else if (diff <= 0) {
          result.status = "waiting";
          result.onDay = diff;
        } else {
          result.status = "failed";
        }
      })();
    }

    /* wishcount */
    result.wishCount = userProject.project.wishCount;

    /* transaction : amount, currency, paymentDue */
    /* only if session's user.id === userProject.user.id */
    if (userId === result.userId) {
      result.others = false;
      result.transaction = {
        amount: userProject.transaction.amount,
        currency: userProject.transaction.currency,
        paymentDue: userProject.transaction.paymentDue
      };
    } else {
      result.others = true;
    }
  }).then(function () {
    /* posts + doneLike */
    return _models2.default.Post.where({ userProjectId: userProjectId }).fetchAll({ withRelated: ["user", "postImages", "likes", "reports"] });
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
    return _models2.default.Wish.where({ userId: userId, projectId: result.projectId }).fetch().then(function (wishes) {
      if (!wishes) {
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

exports.default = fetchUserProjectDetail;
//# sourceMappingURL=fetchUserProjectDetail.js.map
