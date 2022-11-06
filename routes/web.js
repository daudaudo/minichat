var express = require("express");
var router = express.Router();

var homecontroller = require("../app/controllers/home");
var oauthcontroller = require("../app/controllers/oauth");
var authcontroller = require("../app/controllers/auth");
var chatcontroller = require("../app/controllers/chat");
var usercontroller = require("../app/controllers/user");
var postcontroller = require("../app/controllers/post");

var registerValidator = require("../app/validators/register");
var loginValidator = require("../app/validators/login");
var { validateWithRedirect } = require("../app/middlewares/validate");
var auth = require("../app/middlewares/auth");
var adminAuth = require("../app/middlewares/adminauth");
var webMiddleware = require("../app/middlewares/web");
var csrf = require("../app/middlewares/csrf");
var validatePost= require('../app/validators/post')

router.all('*', webMiddleware);

//Home Router
router.get('/', homecontroller.home);
router.get('/chat', chatcontroller.index);
router.get('/room/:id', chatcontroller.room);
router.post('/room/files', chatcontroller.files);

// Oauth Router
router.get('/google/oauth', oauthcontroller.oauthGoogle);
router.get('/google/oauth/callback', oauthcontroller.callbackGoogle);

// Auth Router
router.get('/register', authcontroller.showRegisterForm);
router.post('/register', registerValidator, validateWithRedirect(), authcontroller.register);
router.get('/login', authcontroller.showLoginForm);
router.post('/login', loginValidator, validateWithRedirect(), authcontroller.login);
router.get('/user', auth, authcontroller.user);
router.get('/logout', auth, authcontroller.logout);

//User Router

router.get('/profile', auth, usercontroller.showUpdateProfilesForm);
router.post('/profile', auth, csrf, require('../app/validators/update-profile'), validateWithRedirect('/profile'), usercontroller.postProfile);


//Post Router
router.get('/post',postcontroller.getAllPostByConditions);
router.post('/post',validatePost,postcontroller.createPost);
router.post('/post-update/:id',validatePost,postcontroller.updatePost);
router.post('/post-like/:id',postcontroller.likePost);
router.post('/my-post',postcontroller.getMyPost);
router.post('/post-delete/:id',postcontroller.deletePost);



// Admin Router

router.get("/admin/login", require("../app/controllers/admin/auth").showLoginForm);
router.get("/admin/dashboard", adminAuth, require("../app/controllers/admin/dashboard").index);
router.get("/admin/users", adminAuth, require("../app/controllers/admin/users").index);
router.post("/admin/login", loginValidator, validateWithRedirect(), require("../app/controllers/admin/auth").loginAdmin);

module.exports = router;
