/**
 * Created by Ahmet on 10/28/2016.
 */
var express = require('express');
var router = express.Router();
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var dbVar = mongoose.connection;
var db = require('monk')('localhost/articleDB');
var multer = require('multer');
var upload = multer({dest: './images'});

router.get('/new',isAuth, function (req, res, next) {
    var categories = db.get('categories');

    categories.find({},{}, function (err, categories) {
        res.render('newpost', {
            'title': "Add a New Post",
            'categories': categories
         })
    });

});

router.post('/new', isAuth, upload.single('articleImage'), function (req, res, next) {
   //Just like we did for register page
    var title= req.body.title;
    var category= req.body.category;
    var article= req.body.article;
    var author= req.body.author;
    var date = new Date();

    console.log('OMG its working!');
    console.log(title);
    console.log(article);

    if(req.file){
        console.log('A image uploaded');
        var articleImage = req.file.filename;
    }
    else{
        console.log('No image');
        var articleImage = 'defaultImage.jpg';
    }

    //Validation for title and article body
    req.checkBody('title', 'Title field is required!').notEmpty();
    req.checkBody('article', 'Article field is required!').notEmpty();

    //Check for Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('newpost', {
            "errors": errors
        });
    }
    else{
        var articles = db.get('articles');
        articles.insert({
            "title": title,
            "article" : article,
            "category": category,
            "author": author,
            "date": date,
            "articleImage": articleImage
        }, function (err, post) {
            if(err){
                res.send(err);
            }
            else
            {
                req.flash('success', 'The article Added' );
                res.location('/');
                res.redirect('/');
            }
        })
    }
});

function isAuth(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;