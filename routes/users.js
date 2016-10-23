var express = require('express');
var router = express.Router();
//To use Multer File Upload Tool in Registration Page
var uploadImage = require('multer');
var upload = uploadImage({dest: './images'});
var varPassport = require('passport');
var passportLocal = require('passport-local').Strategy; //Special for PassportJS


var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',
    varPassport.authenticate('local', {failureRedirect:'/users/login'}),
    function(req, res) {
      req.flash('success', 'Successfully logged in');
      // `req.user` contains the authenticated user.
      res.redirect('/');
});

varPassport.serializeUser(function(user, done) {
  done(null, user.id);
});

varPassport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

varPassport.use(new passportLocal(function (username, password, done) {
  User.getUserByUsername(username, function (err, user) {
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Please register first!'});
    }
    
    User.conparePassword(password, user.password, function (err, isMatch) {
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      }
      else
      {
        return done(null, false, {message:'Invalid Password'});
      }
    })
  });
}));

router.get('/logout', function(req, res, next) {
  res.render('layout');
});

//TODO: Create the models!
router.post('/register', upload.single('userImage') , function(req, res, next) {
  //To show the registration information on the console (Not really necessary to implement)
  // console.log("Name: " + req.body.name);
  // console.log("Last Name: " + req.body.lastName);
  // console.log("Email: " + req.body.email);
  // console.log("Username: " + req.body.username);
  // console.log("Password: " + req.body.password);
  // console.log(req.file);

  //And here comes the necessary part
  var name = req.body.name;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var secondPassword = req.body.secondPassword;
  var userImage = req.file.userImage;


  //Validation using Express Validator
  req.checkBody('name', 'This field is required').notEmpty();
  req.checkBody('lastName', 'This field is required').notEmpty();
  req.checkBody('email', 'This field is required').notEmpty();
  req.checkBody('username', 'This field is required').notEmpty();
  req.checkBody('password', 'This field is required').notEmpty();
  req.checkBody('secondPassword', 'This field is required').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors)
  {
    res.render('register', {
      errors: errors
    });
  }
  else {
    var newUser = new User({
      name: name,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
      userImage: userImage
    });

    User.createUser(newUser, function () {
      // if(err) throw err
      console.log(newUser);
    });
    //TODO: Fix the style of success and error messages
    req.flash('success', 'Register completed!');
    res.location('/');
    res.redirect('/');
  }


});

router.post('/login', function(req, res, next) {

});

module.exports = router;
