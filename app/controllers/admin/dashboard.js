/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
    res.render('admin/dashboard');
}

module.exports = {index};
