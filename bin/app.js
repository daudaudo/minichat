/**
 * Load enviroment form a .env file
 */

require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session)
var Redis = require("ioredis");

var webRouter = require('../routes/web');
var apiRouter = require('../routes/api');

var app = express();

// view engine setup
app.set('views', path.join(path.dirname(__dirname), 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname(__dirname), 'public')));

/**
 * Use redis session
 */
var redisClient = new Redis(6379, 'minichat-redis');
var redisStore = new RedisStore({client: redisClient});
app.use(session({
  store: redisStore,
  secret: 'minichat',
  resave: true,
  saveUninitialized: true,
}));

/**
 * Register router web and api
 */

app.use('/', webRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app, redisClient, redisStore};
