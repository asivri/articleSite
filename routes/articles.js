/**
 * Created by Ahmet on 10/28/2016.
 */
var express = require('express');
var router = express.Router();
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var dbVar = mongoose.connection;
var db = require('monk')('localhost/articleDB');

router.get('/new',isAuth, function (req, res, next) {
    res.render('newpost', {
       'title': "Add a New Post"
    })
});

function isAuth(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/users/login');

}

module.exports = router;