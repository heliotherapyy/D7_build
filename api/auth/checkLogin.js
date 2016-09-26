"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var checkLogin = function checkLogin() {
  return function (req, res) {
    if (req.user) {
      res.status(200).send({ loggedIn: true });
    } else {
      res.status(200).send({ loggedIn: false });
    }
  };
};

exports.default = checkLogin;
//# sourceMappingURL=checkLogin.js.map
