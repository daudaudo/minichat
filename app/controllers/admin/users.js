const User = require('../../models/User');
const Role = require('../../models/Role');
const perPage = 10;


/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function banUser(req, res) {
  var filter = { _id: req.body.id };
  var update = { suspended_at: new Date() };
  await User.updateOne(filter, update);
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function deleteUser(req, res) {
  var filter = { _id: req.body.id };
  await User.deleteOne(filter);
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function index(req, res) {
    var page = parseInt(req.query.page);
    if (page == NaN)
        page = 1;
    
    var users = await User.find({
        'role' : Role.NORMAL_ROLES,
    }).limit(perPage).skip(page - 1);

    res.render('admin/users', {users: users, page});
}

module.exports = { index, banUser, deleteUser };
