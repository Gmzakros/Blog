var createError = require('http-errors');
require('dotenv').config({ path: './.env' });
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
require('./app_api/models/db');
require('./app_api/config/passport');
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var routesApi = require('./app_api/routes/index');

var app = express();

// view engine setup
var viewPath = path.join(__dirname, './app_server/views');

app.set('views', viewPath);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use('/users', usersRouter);
app.use(passport.initialize());
app.use('/api', routesApi);
// Added per Lab 5 - Angular
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

app.use(function(err, req, res, next){
  if(err.name === 'UnauthorizedError'){
    res.status(401);
    res.json({"message" : err.name + ": " + err.message})
  }
})
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

module.exports = app;
