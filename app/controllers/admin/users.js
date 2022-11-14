const User = require('../../models/User');
const Role = require('../../models/Role');
const paginate = require('../../global/paginate');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    var paginationData = await paginate(req, User, {'role': Role.NORMAL_ROLES, deleted_at: null, });

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

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function bulkDeleteUsers(req, res) {
    var ids = req.body['ids[]'] ?? [];
    if (ids instanceof Array) {
        await User.updateMany({_id: {$in: ids}}, {deleted_at: new Date()});
    } else if (typeof ids == 'string') {
        await User.findByIdAndUpdate(ids, {deleted_at: new Date()});
    }

    res.send('Bulk delete successfully');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function suspendUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (!user) {
        res.status(404);
        res.send('Not found');
        return;
    }

    if (user.suspended_at) {
        user.suspended_at = null;
    } else {
        user.suspended_at = new Date();
    }
    await user.save();

    res.send(user);
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function bulkSuspendUsers(req, res) {
    var ids = req.body['ids[]'] ?? [];
    if (ids instanceof Array) {
        await User.updateMany({_id: {$in: ids}}, {suspended_at: new Date()});
    } else if (typeof ids == 'string') {
        await User.findByIdAndUpdate(ids, {suspended_at: new Date()});
    }

    res.send('Bulk delete successfully');
}

module.exports = {index, deleteUser, suspendUser, bulkDeleteUsers, bulkSuspendUsers};
