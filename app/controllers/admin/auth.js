/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function showLoginForm(req, res) {
    res.render('admin/login');
}

module.exports = {showLoginForm};
