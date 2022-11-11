const User = require('../../models/User');
const Role = require('../../models/Role');
const paginate = require('../../global/paginate');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    var paginationData = await paginate(req, User, {'role': Role.NORMAL_ROLES, deleted_at: null, suspended_at: null, });

    res.render('admin/users', {...paginationData});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function deleteUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (!user) {
        res.status(404);
        res.send('Not found');
        return;
    }

    user.deleted_at = new Date();
    await user.save();

    res.send(user);
}

async function suspendUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (!user) {
        res.status(404);
        res.send('Not found');
        return;
    }

    user.suspended_at = new Date();
    await user.save();

    res.send(user);
}

module.exports = {index, deleteUser, suspendUser};
