const User = require('../../models/User');
const Role = require('../../models/Role');
const paginate = require('../../global/paginate');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    var paginationData = await paginate(req, User, {'role': Role.NORMAL_ROLES});

    res.render('admin/users', {...paginationData});
}

module.exports = {index};
