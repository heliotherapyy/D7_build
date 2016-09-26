"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setConfig = require("./setConfig");

var _setConfig2 = _interopRequireDefault(_setConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetDB = function resetDB() {

  /* If tables exist, drop all tables at first */
  _setConfig2.default.knex.schema.dropTableIfExists("user").dropTableIfExists("project").dropTableIfExists("userProject").dropTableIfExists("post").dropTableIfExists("postImage").dropTableIfExists("like").dropTableIfExists("wish").dropTableIfExists("transaction").dropTableIfExists("report")

  /* After table drops, add new tables */
  .createTableIfNotExists("user", function (user) {
    user.increments("id").primary();
    user.string("email").unique().index();
    user.string("password");
    user.string("username");
    user.string("photo");
    user.timestamps();
    console.log("created table user");
  }).createTableIfNotExists("project", function (project) {
    project.increments("id").primary();
    project.integer("userId").references("id").inTable("user");
    project.string("title");
    project.string("description");
    project.text("image");
    project.integer("wishCount");
    project.timestamps();
    console.log("created table project");
  }).createTableIfNotExists("userProject", function (userProject) {
    userProject.increments("id").primary();
    userProject.integer("userId").references("id").inTable("user");
    userProject.integer("projectId").references("id").inTable("project");
    userProject.date("startAt");
    userProject.date("endAt");
    userProject.boolean("success");
    userProject.timestamps();
    console.log("created table userProject");
  }).createTableIfNotExists("post", function (post) {
    post.increments("id").primary();
    post.integer("userId").references("id").inTable("user");
    post.integer("projectId").references("id").inTable("project");
    post.integer("userProjectId").references("id").inTable("userProject");
    post.integer("day");
    post.integer("likeCount");
    post.text("text");
    post.timestamps();
    console.log("created table post");
  }).createTableIfNotExists("postImage", function (postImage) {
    postImage.increments("id").primary();
    postImage.integer("postId").references("id").inTable("post");
    postImage.integer("index");
    postImage.text("url");
    postImage.timestamps();
    console.log("created table postImage");
  }).createTableIfNotExists("like", function (like) {
    like.increments("id").primary();
    like.integer("userId").references("id").inTable("user");
    like.integer("postId").references("id").inTable("post");
    like.timestamps();
  }).createTableIfNotExists("wish", function (wish) {
    wish.increments("id").primary();
    wish.integer("userId").references("id").inTable("user");
    wish.integer("projectId").references("id").inTable("project");
    wish.timestamps();
  }).createTableIfNotExists("transaction", function (transaction) {
    transaction.increments("id").primary();
    transaction.integer("userId").references("id").inTable("user");
    transaction.integer("userProjectId").references("id").inTable("userProject");
    transaction.string("customer_uid");
    transaction.string("merchant_uid");
    transaction.date("paymentDue");
    transaction.integer("amount");
    transaction.string("currency");
    transaction.boolean("refund");
    transaction.timestamps();
  }).createTableIfNotExists("report", function (report) {
    report.increments("id").primary();
    report.integer("userId").references("id").inTable("user");
    report.integer("postId").references("id").inTable("post");
    report.text("description");
    report.timestamps();
  }).then(function () {
    return console.log("reset DB");
  });
}; /* Defines DB Schema */

exports.default = resetDB;
//# sourceMappingURL=reset.js.map
