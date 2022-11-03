const auth = require('../global/auth');
const Storage = require('../global/storage');
const Post = require("../models/Post");



/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */


async function createPost(req,res){
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

async function getAllPostByConditions(req,res){
    // var user = auth.user(req);
    var user = null;
    if(!user){
        user = {
            username: "Nguyễn Didi"
        }
    }
    let posts= await Post.find({});
    if(posts.length==0){
        posts=[
            {
                _id: Math.floor(Math.random() * 10),
                title : "Building a Truly Hybrid Event Experience hahahahaha",
                content:"Virtual presenters and panelists. The convenience and ease of Zoom removes so many barriers for presenters and panelists alike. A key moment of our event was a panel discussion with three Zoom customers all participating virtually. We were able to secure a powerful and memorable session without asking them to travel and sacrifice additional time.",
                imageUrl: "",
                isLiked:false,
                usernameOnwner: "Nguyễn Didi",
                createdAt: "10 Tháng 10, 2022"
            },
            {
                _id: Math.floor(Math.random() * 10),
                title : "Building a Truly Hybrid Event Experience",
                content:"Virtual presenters and panelists. The convenience and ease of Zoom removes so many barriers for presenters and panelists alike. A key moment of our event was a panel discussion with three Zoom customers all participating virtually. We were able to secure a powerful and memorable session without asking them to travel and sacrifice additional time.",
                imageUrl: "",
                isLiked:false,
                usernameOnwner: "Nguyễn Didi",
                createdAt: "12 Tháng 10, 2022"
            },
            {
                _id: Math.floor(Math.random() * 10),
                title : "Building a Truly Hybrid Event Experience",
                content:"Virtual presenters and panelists. The convenience and ease of Zoom removes so many barriers for presenters and panelists alike. A key moment of our event was a panel discussion with three Zoom customers all participating virtually. We were able to secure a powerful and memorable session without asking them to travel and sacrifice additional time.",
                imageUrl: "",
                isLiked:false,
                usernameOnwner: "Nguyễn Didi",
                createdAt: "11 Tháng 10, 2022"
            }
        ]
    };
    const data = {
        user : user,
        posts:posts
    }
    res.render('post',{data: data})
};

async function getMyPost(req,res){
    // var user = auth.user(req);
    var user = null;
    if(!user){
        user = {
            username: "Nguyễn Didi"
        }
    }
    let posts= await Post.find({$where:{usernameOnwner : user.username}});
    if(posts.length==0){
        posts=[
            {
                _id: Math.floor(Math.random() * 10),
                title : "Building a Truly Hybrid Event Experience hahahahaha",
                content:"Virtual presenters and panelists. The convenience and ease of Zoom removes so many barriers for presenters and panelists alike. A key moment of our event was a panel discussion with three Zoom customers all participating virtually. We were able to secure a powerful and memorable session without asking them to travel and sacrifice additional time.",
                imageUrl: "",
                isLiked:false,
                usernameOnwner: "Nguyễn Didi",
                createdAt: "10 Tháng 10, 2022"
            },
            {
                _id: Math.floor(Math.random() * 10),
                title : "Building a Truly Hybrid Event Experience",
                content:"Virtual presenters and panelists. The convenience and ease of Zoom removes so many barriers for presenters and panelists alike. A key moment of our event was a panel discussion with three Zoom customers all participating virtually. We were able to secure a powerful and memorable session without asking them to travel and sacrifice additional time.",
                imageUrl: "",
                isLiked:false,
                usernameOnwner: "Nguyễn Didi",
                createdAt: "12 Tháng 10, 2022"
            },
            {
                _id: Math.floor(Math.random() * 10),
                title : "Building a Truly Hybrid Event Experience",
                content:"Virtual presenters and panelists. The convenience and ease of Zoom removes so many barriers for presenters and panelists alike. A key moment of our event was a panel discussion with three Zoom customers all participating virtually. We were able to secure a powerful and memorable session without asking them to travel and sacrifice additional time.",
                imageUrl: "",
                isLiked:false,
                usernameOnwner: "Nguyễn Didi2",
                createdAt: "11 Tháng 10, 2022"
            }
        ]
        posts = posts.filter(x=> x.usernameOnwner == user.username);
    };
    const data = {
        user : user,
        posts:posts
    }
    res.render('post',{data: data})
};

async function getDetailsPost(req,res){
    const post= await Post.findById(req.params.id);
    res.send(post);
};

async function likePost(req,res){
    const filter = {_id: req.body.id};
    const update ={liked: true};
    await Post.findOneAndUpdate(filter, update);
    res.redirect('/post-details');
};

async function UpdatePost(req,res){
    const filter = {_id: req.body.id};
    await Post.findOneAndUpdate(filter, req.body);
    res.redirect('/post-details');
};

module.exports={UpdatePost,getAllPostByConditions,getDetailsPost,likePost,createPost,getMyPost}