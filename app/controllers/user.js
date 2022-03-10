/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function showUpdateProfilesForm(req, res, next) {
  res.render('profile');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

function postProfile(req, res, next) {
  res.send(req.files);
  //res.redirect('/profile');
}

module.exports = {
  showUpdateProfilesForm,
  postProfile
};
