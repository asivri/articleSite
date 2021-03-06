var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Following step is creating variables for the dependencies:
var bcrypt = require('bcryptjs');
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var dbVar = mongoose.connection;
var db = require('monk')('localhost/articleDB');
var connectFlash = require('connect-flash');
var expressMessages = require('express-messages');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local').Strategy; //Special for PassportJS
//Multer setup (For the file upload processes)
var multer = require('multer');
var upload = multer({dest: './images'});

var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express-session setup
app.use(expressSession({
  secret: 'asivri', //The secret used to sing the session ID cookie. Can be anything
  saveUninitialized: true, //Forces a session that is "uninitialized" to be saved to the store.
  //The doc of express-session says it's handy to set it as false for storage usage etc.
  resave: true
}));

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Express-messages setup
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//To check wheter user is logged in or not
app.use('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
