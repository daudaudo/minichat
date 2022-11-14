const Post = require('../../models/Post');
const paginate = require('../../global/paginate');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    var search = req.query.search ?? '';
    var filter = {
        $and: [
            {
                deleted_at: null,
            }, {
                $or: [
                    { content: new RegExp(search) },
                ]
            }
        ]
    };

    var paginationData = await paginate(req, Post, filter);
    res.render('admin/posts', {...paginationData});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

 async function bulkDeletePost(req, res) {
    var ids = req.body['ids[]'] ?? [];
    if (ids instanceof Array) {
        await Post.updateMany({_id: {$in: ids}}, {deleted_at: new Date()});
    } else if (typeof ids == 'string') {
        await Post.findByIdAndUpdate(ids, {deleted_at: new Date()});
    }

    res.send('Bulk delete successfully');
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

module.exports = {index, deletePost, bulkDeletePost};
