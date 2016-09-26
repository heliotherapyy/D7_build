"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var logout = function logout() {
  return function (req, res) {
    console.log(req.user);
    req.logOut();
    // res.redirect("/");
    return res.status(200).json({
      message: "You have been successfully logged out."
    });
  };
};

exports.default = logout;
//# sourceMappingURL=logout.js.map
