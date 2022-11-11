const auth = require('../global/auth');
const User = require('../models/User');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    res.render('post', {filter: {}})
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function getMyPost(req, res) {
    res.render('post', {filter: {owner: auth.user(req)._id}});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function getWall(req, res) {
    var _id = req.params.id;
    var user = await User.findById(_id);

    if (!user) 
        return res.status(404).render('errors/404');

    res.render('post', {filter: {owner: _id}});
}

module.exports = {index, getMyPost, getWall}
