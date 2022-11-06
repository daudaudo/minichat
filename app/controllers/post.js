const auth = require('../global/auth');
const Post = require("../models/Post");
const dayjs = require('dayjs');
const {ObjectId} = require('mongodb')

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */


async function createPost(req,res){
    var user = auth.user(req);
    user._id = "6366af593c0c88a0552ad3a0";
    var data = new Post({
        owner: ObjectId(user._id),
        title : req.body.title,
        content: req.body.content,
        is_liked: false
    });
    await Post.create(data);
    req.flash('success', {update: {msg: 'Create post successfully'}});
    res.redirect('/post');
};

async function getAllPostByConditions(req,res){
    var user = auth.user(req);
    let posts= await Post.find({}).sort({'created_at':-1}).populate("owner");
    const value = "Tháng";
    posts = posts.map(item=>{
        item.owner = item.owner.username;
        let date = dayjs(item.created_at).format('DD : MM YYYY');
        item.date = date.replace(':',`${value}`);
        return item;
    });
    const data = {
        user : user,
        posts:posts.length>0? posts: [] 
    }
    // return res.json(data);
    res.render('post',{data: data})
};

async function getMyPost(req,res){
    var user = auth.user(req);
    var id=  ObjectId(user._id);
    let posts= await Post.find({$where:{owner : id}}).sort({'created_at':-1});
    const data = {
        user : user,
        posts:posts.length>0? posts: [] 
     }
    res.render('post',{data: data})
};

async function likePost(req,res){
    const filter = {_id: req.params.id};
    const post = await Post.findById(filter);
    let update = {};
    if(post.isLiked == true){
        update= {isLiked : false}
    }else{
        update= {isLiked : true}
    }
    await Post.findOneAndUpdate(filter, update);
    res.redirect('/post');
};

async function updatePost(req,res){
    const filter = {_id: req.params.id};
    let update = req.body;
    await Post.findByIdAndUpdate(filter,update);
    res.redirect('/post');
};

async function deletePost(req,res){
    const filter = {_id: req.params.id};
    await Post.deleteOne(filter);
    res.redirect('/post');
};

module.exports={updatePost,getAllPostByConditions,likePost,createPost,getMyPost,deletePost}