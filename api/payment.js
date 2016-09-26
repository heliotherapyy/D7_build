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

/* Send payment request to Iamport and create new transaction in 'transaction' table */
/* Post Data: postId */

var payment = function payment(user, q, body, res) {
  var userId = user.id;
  var username = user.username;

  var userProjectId = body.userProjectId;
  var endAt = body.endAt;

  var payment = body.payment;
  /* If payment is not parsed, parse it below */
  if (typeof payment === "string") {
    payment = JSON.parse(payment);
  }

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

  var accessToken = "";
  var today = new Date();
  /* paymentDue is day after endAt date */
  var paymentDue = new Date(endAt);
  paymentDue.setDate(paymentDue.getDate() + 1);
  /* convert paymentDue to 10 digit UNIX timestamp */
  paymentDue = paymentDue.valueOf().toString().slice(0, 10);

  /* Check if all payment infos in the request */
  var _payment = payment;
  var cardNumber = _payment.cardNumber;
  var expiry = _payment.expiry;
  var birth = _payment.birth;
  var pwd2digit = _payment.pwd2digit;
  var amount = _payment.amount;
  var currency = _payment.currency;

  if (!(cardNumber && expiry && birth && pwd2digit && amount && currency)) {
    console.error("Error: NOT enough payment infos are passed through request");
    throw "NOT enough payment infos are passed through request";
  }
  var paymentReq = {
    params: {},
    customer_uid: userId + "---" + username, // distinctive customer uid. If customer_uid is same as before, iamport automatically process with previous card infos even if now we have sent no card infos
    checking_amount: 0, // if you want check the credit card is valid, can validate with checking_amount more then;
    card_number: cardNumber, // stirng, "xxxx-xxxx-xxxx-xxxx"
    expiry: expiry, // string, "yyyy-mm"
    birth: birth, // string, "yymmdd"
    pwd_2digit: pwd2digit, // string, "xx"
    schedules: [{
      "merchant_uid": userId + "-" + userProjectId + "-" + today.valueOf(), // distinctive order uid
      "schedule_at": paymentDue, // 10 digit UNIX timestamp
      "amount": amount // integer
    }]
  };

  console.log("payment in progress");
  return _axios2.default.post("https://api.iamport.kr/users/getToken", _apiKeys2.default).then(function (answer) {
    var data = answer.data;

    /* Check if import response's code is 0 or not */
    /* If 0, it is well responsed, if not, should check message */
    if (data.code === 0) {
      console.log("Success: received access_token: ", data);
      accessToken = data.response.access_token;
      paymentReq.params._token = accessToken;
    } else {
      console.error("Error: Failed to get access_token: ", data.message);
      throw "Failed to get access_token: " + data.message;
    }
  }).then(function () {
    if (accessToken.length === 0) {
      console.error("Failed to store access_token on the server");
      throw "Failed to store access_token on the server";
    }
    console.log("PaymentReqData is ", paymentReq);
    return _axios2.default.post("https://api.iamport.kr/subscribe/payments/schedule?_token=" + accessToken, paymentReq).then(function (answer) {
      return answer;
    });
  }).then(function (answer) {
    var data = answer.data;
    if (data.code === 0) {
      console.log("Success: scheduled transaction: ", data);

      return new _models2.default.Transaction({ userId: userId, userProjectId: userProjectId, customer_uid: data.response[0].customer_uid, merchant_uid: data.response[0].merchant_uid, paymentDue: new Date(data.response[0].schedule_at * 1000).toJSON().slice(0, 10), amount: data.response[0].amount, currency: currency }).save().then(function () {
        /* Return data, if res === null or res === undefined */
        if (!res) {
          console.log("Method use: Return createNewProject Result: ", data);
          return data;
        } else {
          res.status(200).send(data);
        }
      });
    } else {
      console.error("Error: Failed to schedule transaction: ", data);
      throw "Failed to schedule transaction: " + data.message;
    }
  }).catch(function (err) {
    console.error("Error: Failed in transaction in 'payment.js': ", err);

    /* Return err, if res === null or res === undefined */
    if (!res) {
      throw "Failed in transaction in 'payment.js': " + err;
    } else {
      res.status(500).end();
      throw "Failed in transaction in 'payment.js': " + err;
    }
  });
};

exports.default = payment;
//# sourceMappingURL=payment.js.map
