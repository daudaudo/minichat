const auth = require('../global/auth');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    res.render('post', {filter: {}})
};

async function getMyPost(req, res) {
    res.render('post', {filter: {owner: auth.user(req)._id}});
}

module.exports = {index, getMyPost}
