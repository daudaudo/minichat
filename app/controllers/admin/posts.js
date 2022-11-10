const Post = require('../../models/Post');
//const Role = require('../../models/Role');
const paginate = require('../../global/paginate');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    var paginationData = await paginate(req, Post,{deleted_at: null});

    res.render('admin/posts', {...paginationData});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function deletePost(req, res) {
    var id = req.params.id;
    var post = await Post.findById(id);
    if (!post) {
        res.status(404);
        res.send('Not found');
        return;
    }

    post.deleted_at = new Date();
    await post.save();

    res.send(post);
}

module.exports = {index, deletePost};
