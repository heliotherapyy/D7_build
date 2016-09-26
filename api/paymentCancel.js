"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _collections = require("../db/collections");

var _collections2 = _interopRequireDefault(_collections);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _apiKeys = require("./import/apiKeys");

var _apiKeys2 = _interopRequireDefault(_apiKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Send payment cancel request to Iamport and update transaction in 'transactin' table */
/* Post Data: customer_uid, merchant_uid */

var paymentCancel = function paymentCancel(user, q, body, res) {
  var userId = user.id;
  var username = user.username;

  // Test code below
  // let userId;
  // let username;
  // if (user && user.id) {
  //   userId = user.id;
  //   username = user.username;
  // }
  // if (q && q.id) {
  //   userId = q.id;
  //   username = q.username;
  // } else {
  //   userId = 1;
  //   username = "Lenny";
  // }

  var customer_uid = body.customer_uid;
  var merchant_uid = body.merchant_uid;


  var accessToken = "";

  var paymentCancelReq = {
    params: {},
    customer_uid: customer_uid,
    merchant_uid: [merchant_uid]
  };

  return _axios2.default.post("https://api.iamport.kr/users/getToken", _apiKeys2.default).then(function (answer) {
    var data = answer.data;

    /* check if import response's code is 0 or not */
    /* If 0, it is well responsed, if not, should check message */
    if (data.code === 0) {
      console.log("Success: received access_token: ", data);
      accessToken = data.response.access_token;
      paymentCancelReq.params._token = accessToken;
    } else {
      console.error("Error: Failed to get access_token: ", data.message);
      throw "Failed to get access_token: " + data.message;
    }
  }).then(function () {
    if (accessToken.length === 0) {
      console.error("Failed to store access_token on the server");
      throw "Failed to store access_token on the server";
    }
    console.log("paymentCancelInfo is ", paymentCancelReq);
    return _axios2.default.post("https://api.iamport.kr/subscribe/payments/unschedule?_token=" + accessToken, paymentCancelReq).then(function (answer) {
      return answer;
    });
  }).then(function (answer) {
    var data = answer.data;
    if (data.code === 0) {
      console.log("Success: unscheduled transaction: ", data);
      /* Return data, if res === null or res === undefined */
      if (!res) {
        console.log("Method use: Return record Result: ", data);
        return data;
      } else {
        res.status(200).send(data);
      }
    } else {
      console.error("Error: Failed to unschedule transaction: ", data);
      throw "Failed to unschedule transaction: " + data.message;
    }
  }).catch(function (err) {
    console.error("Error: Failed in canceling transaction in 'paymentCancel.js': ", err);

    /* Return err, if res === null or res === undefined */
    if (!res) {
      throw "Failed in canceling transaction in 'paymentCancel.js': " + err;
    } else {
      res.status(500).end();
      throw "Failed in canceling transaction in 'paymentCancel.js': " + err;
    }
  });
};

exports.default = paymentCancel;
//# sourceMappingURL=paymentCancel.js.map
