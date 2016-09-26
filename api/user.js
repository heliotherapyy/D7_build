"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Update user detail in 'user' table */
/* Post Data: userPhoto(publicId from Cloudinary), username, password, email */
var user = function user(_user, q, body, res) {
  var userId = _user.id;
  var userPhoto = body.userPhoto;
  var username = body.username;
  var password = body.password;
  var email = body.email;

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

  var editData = {
    photo: userPhoto,
    username: username,
    password: password,
    email: email
  };

  /* Delete keys with undefined value */
  for (var key in editData) {
    if (editData[key] === undefined) {
      delete editData[key];
    }
  }

  _models2.default.User.where("id", userId).fetch().then(function (user) {
    if (user) {
      return user;
    } else {
      /* Throw error if there is now user matching */
      throw "Invalid userId";
    }
  }).then(function (user) {
    /* check for empty property */
    for (var _key in editData) {
      if (editData[_key] === undefined) {
        delete editData[_key];
      }
    }
    return new _models2.default.User({ id: user.id }).save(editData);
  }).then(function (data) {
    data = data.toJSON();
    res.status(200).send(data);
  }).catch(function (err) {
    return "Error: Failed to edit user profile: " + err;
  });
};

exports.default = user;
//# sourceMappingURL=user.js.map
