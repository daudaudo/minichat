const Post = require('../../models/Post');
//const Role = require('../../models/Role');
const paginate = require('../../global/paginate');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    var paginationData = await paginate(req, Post);

    res.render('admin/posts', {...paginationData});
}

module.exports = {index};
