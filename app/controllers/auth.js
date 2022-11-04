var User = require('../models/User');
var bcrypt = require('bcrypt')
var dayjs = require('dayjs');
var uuid = require('uuid');

const homeUrl = '/';

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function showLoginForm(req, res) {
  res.render('login');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function login(req, res) {
  try {
    var user = await User.findOne({ email: req.body.email}).select('+password');
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      req.session.auth = {
        user: user,
        token: uuid.v4(),
        auth: true,
      }
      res.redirect(homeUrl);
    } else {
      req.flash('errors', {auth: {msg: 'The email or password is not valid!'}});
      res.redirect('/login');
    }
  } catch (err) {
    req.flash('errors', {auth: {msg: 'The email or password is not valid!'}});
    res.redirect('/login');
  }
  
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function showRegisterForm(req, res) {
  res.render('register');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
async function register(req, res) {
  try {
    var user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    })

    req.flash('success', {
      message: 'Register an account successfully!'
    });

    res.redirect('/login');
  } catch (err) {
    res.send(err);
  }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function user(req, res) {
  res.send(req.session.auth.user);
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
function logout(req, res) {
  try {
    req.session.destroy(() => {
      res.redirect(homeUrl);
    });
  } catch(err) {
    res.status(500).send(err);
  }
}

module.exports = {
  showLoginForm,
  login,
  showRegisterForm,
  register,
  user,
  logout
}
