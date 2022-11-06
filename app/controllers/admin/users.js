/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

const User = require("../../models/User");

async function index(req, res) {
  res.render("admin/users");
}

async function banUser(req, res) {
  var filter = { _id: req.body.id };
  var update = { suspended_at: new Date() };
  await User.updateOne(filter, update);
}

async function deleteUser(req, res) {
  var filter = { _id: req.body.id };
  await User.deleteOne(filter);
}

module.exports = { index, banUser, deleteUser };
