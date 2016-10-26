var express = require('express');
var router = express.Router();
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var dbVar = mongoose.connection;
var db = require('monk')('localhost/articleDB');
/* GET home page. */


router.get('/',function(req, res, next) {
  var db = req.db;
  var articles = db.get('articles');
  articles.find({}, {}, function (err, articles) {
    res.render('index', { articles: articles});
  })
});

function isAuth(req, res, next){
  if(req.isAuthenticated())
  {
    return next();
  }
  res.redirect('/users/login');

}

router.get('/about', function(req, res, next) {
  res.render('about');
});


module.exports = router;
