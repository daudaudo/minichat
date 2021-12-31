var express = require('express');
var router = express.Router();
var homecontroller = require('../app/controllers/home')

/* GET home page. */
router.get('/', homecontroller.home);

module.exports = router;
