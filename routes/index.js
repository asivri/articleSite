var express = require('express');
var router = express.Router();

/* GET home page. */
function isAuth(req, res, next){
  if(req.isAuthenticated())
  {
    return next();
  }
  else{
    res.redirect('/users/login');
  }
}

router.get('/', isAuth,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});


module.exports = router;
