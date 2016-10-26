var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', isAuth,function(req, res, next) {
  res.render('index', { title: 'Express' });
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
