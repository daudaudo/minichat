const User = require('../../models/User');
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    const users = await User.find({});
    res.render('admin/users',{users: users, index: 0});
}

module.exports = {index};
