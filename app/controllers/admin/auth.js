
const User = require("../../models/User");
const Role = require("../../models/Role");
const bcrypt = require('bcrypt');
const uuid = require('uuid');


const dashboardUrl = "/admin/dashboard";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function showLoginForm(req, res) {
  res.render("admin/login");
}

async function loginAdmin(req, res) {
  try {

    var user = await User.findOne({ email: req.body.email }).select("+password");
    if (user && user.role != Role.ADMIN_ROLES) {
      req.flash("errors", {auth: { msg: "This is not a admin account" }, });
      res.redirect("/admin/login");
      return;
    }
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      req.session.auth = {user: user, token: uuid.v4(), auth: true, };
      res.redirect(dashboardUrl);
    } else {
      req.flash("errors", { auth: { msg: "The email or password is not valid!" }, });
      res.redirect("/admin/login");
    }
  } catch (err) {
    req.flash("errors", {auth: { msg: "Other Error!!" }, });
    res.redirect("/admin/login");
  }
}

module.exports = { showLoginForm, loginAdmin };
