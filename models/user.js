var mongoose = require('mongoose');

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
    newUser.save(callback);
};