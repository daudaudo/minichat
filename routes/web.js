var express = require('express');
var router = express.Router();

var homecontroller = require('../app/controllers/home');
var oauthcontroller = require('../app/controllers/oauth');
var authcontroller = require('../app/controllers/auth');
var chatcontroller = require('../app/controllers/chat');
var usercontroller = require('../app/controllers/user');
var postController = require('../app/controllers/post');

var registerValidator = require('../app/validators/register');
var loginValidator = require('../app/validators/login');
var {validateWithRedirect} = require('../app/middlewares/validate');
var auth = require('../app/middlewares/auth');
var webMiddleware = require('../app/middlewares/web');
var csrf = require('../app/middlewares/csrf');

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
router.get('/post',auth,postController.getAllPostByConditions);
router.get('post-details',auth,postController.getDetailsPost);
router.post('post',auth,postController.createPost);
router.post('post-update',auth,postController.UpdatePost);
router.post('post-like',auth,postController.likePost);
router.post('category-post',auth,postController.createCategoryPost);
router.get('category-post',auth,postController.getCategoryPost);




module.exports = router;
