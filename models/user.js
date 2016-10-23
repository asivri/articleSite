var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/articleDB');

var db = mongoose.connection;

//Set the user schema for the login system
var userSchema = mongoose.Schema({
    username:{
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }, 
    lastName: {
        type: String
    },
    userImage: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function (newUser, callback) {
    //Async bcrypt
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};