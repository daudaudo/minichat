const User = require('../../models/User');
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */



async function banUser(req, res) {
  var filter = { _id: req.body.id };
  var update = { suspended_at: new Date() };
  await User.updateOne(filter, update);
}

async function deleteUser(req, res) {
  var filter = { _id: req.body.id };
  await User.deleteOne(filter);

async function index(req, res) {
    const users = await User.find({});
    res.render('admin/users',{users: users, index: 0});

}

module.exports = { index, banUser, deleteUser };
