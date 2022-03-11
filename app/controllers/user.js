const auth = require('../global/auth');
const Storage = require('../global/storage');
const User = require('../models/User');

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

async function postProfile(req, res, next) {
  var filename = Storage.fromFolder('public/avatar').upload(req.files.picture);
  var user = auth.user(req);
  var filter = {email: user.email};
  var updateData = {
    username: req.body.username,
    introduction: req.body.introduction,
    picture: filename ? Storage.url(filename) : user.picture
  }

  if (filename) 
    Storage.deleteFromUrl(user.picture);
  
  await User.updateOne(filter, updateData);
  user = await User.findOne(filter);
  auth.setUser(req, user);
  res.redirect('/profile');
}

module.exports = {
  showUpdateProfilesForm,
  postProfile
};
