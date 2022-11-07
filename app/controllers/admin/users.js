const User = require('../../models/User');
const Role = require('../../models/Role');
const perPage = 10;

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
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

module.exports = {index};
