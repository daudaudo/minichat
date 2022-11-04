const Comment = require("../models/Comment");
const auth = require("../global/auth");
const dayjs = require("dayjs");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

async function post_comment(req, res) {
  try {
    var user = auth.user(req);
    var data = {
      content: req.body.content,
      user_id: user._id,
      post_id: req.params.id,
      like_count: 0,
    };
    await Comment.create(data);
    req.flash("success", { update: { msg: "Update profife successfully" } });
    res.status(200).json("oke");
  } catch (e) {
    res.send(e);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

async function update_comment(req, res) {
  try {
    console.log(req);
    var user = auth.user(req);
    var find = { _id: req.params.id };
    var data = {
      content: req.body.content,
    };
    console.log(data);
    await Comment.updateOne(find, data);
    req.flash("success", { update: { msg: "Update profife successfully" } });
    res.status(200).json("oke");
  } catch (e) {
    res.send(e);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

async function delete_comment(req, res) {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { deleted_at: new Date() });
  } catch (err) {
    console.log(err);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

function get_comment(req, res, next) {
  res.render("comment");
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

async function like(req, res) {
  try {
    var user = auth.user(req);
    var filter = { _id: req.params.id };
    var comment = await Comment.findOne(filter);
    if (comment.like.includes(user._id)) {
      var index = comment.like.indexOf(user._id);
      comment.like.splice(index, 1);
      await Comment.updateOne(filter, { like: comment.like });
    } else {
      comment.like.push(user._id);
      await Comment.updateOne(filter, { like: comment.like });
    }
    res.status(200).json("oke");
  } catch (e) {
    console.log("loi ne", e);
    res.send(e);
  }
}

module.exports = {
  post_comment,
  update_comment,
  get_comment,
  delete_comment,
  like,
};
true;
