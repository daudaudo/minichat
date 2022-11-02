const auth = require('../global/auth');
const Storage = require('../global/storage');
const Post = require("../models/Post");
const CategoryPost = require('../models/CategoryPost');


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.createCategoryPost= async (req,res)=>{
    var data ={
        name : req.body.name,
        desc: req.body.desc,
        content: req.body.content,
        imageUrl: req.body.imageUrl
    };
    await CategoryPost.create(data);
    res.json("Create category post successfullly!")
};

exports.getCategoryPost= async (req,res)=>{
    var categoryPost = await CategoryPost.find();
    res.send(categoryPost);
};
exports.createPost= async(req,res)=>{
    var user = auth.user(req);
    var data ={
        usernameOwner: user.username,
        title : req.body.title,
        content: req.body.content
    };
    await Post.create(data);
    req.flash('success', {update: {msg: 'Create post successfully'}});
    res.redirect('/post');
};

exports.getAllPostByConditions= async(req,res)=>{
    const {query} = req;
    let condition = {
        categoryId: query.categoryId
    }
    const posts= await Post.find({$where:condition });
    res.send(posts);
};

exports.getDetailsPost= async(req,res)=>{
    const post= await Post.findById(req.params.id);
    res.send(post);
};
exports.likePost= async(req,res)=>{
    const filter = {_id: req.body.id};
    const update ={liked: true};
    await Post.findOneAndUpdate(filter, update);
    res.redirect('/post-details');
};

exports.UpdatePost= async(req,res)=>{
    const filter = {_id: req.body.id};
    await Post.findOneAndUpdate(filter, req.body);
    res.redirect('/post-details');
};