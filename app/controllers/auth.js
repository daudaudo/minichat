var User = require("../models/User");
var bcrypt = require("bcrypt");
var uuid = require("uuid");

const homeUrl = "/";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function showLoginForm(req, res) {
  res.render("login");
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function login(req, res) {
  try {
    var user = await User.findOne({ email: req.body.email }).select("+password");
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      if (user.deleted_at) {
        return redirectLoginWithMessage(req, res, "Your account has been deleted !!");
      }
      if (user.suspended_at) {
        return redirectLoginWithMessage(req, res, "Your account has been suspended !!");
      }

      req.session.auth = {
        user: user,
        token: uuid.v4(),
        auth: true,
      };
      res.redirect(homeUrl);
    } else {
      return redirectLoginWithMessage(req, res, "The email or password is not valid !!");
    }
  } catch (err) {
    return redirectLoginWithMessage(req, res, "The email or password is not valid !!");
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function showRegisterForm(req, res) {
  res.render("register");
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
    });

    req.flash("success", {
      message: "Register an account successfully!",
    });

    res.redirect("/login");
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
  } catch (err) {
    res.status(500).send(err);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Object} msg
 */
function redirectLoginWithMessage(req, res, msg) {
  req.flash("errors", {
    auth: { msg },
  });
  res.redirect("/login");
}

module.exports = {
  showLoginForm,
  login,
  showRegisterForm,
  register,
  user,
  logout,
};
