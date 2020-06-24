var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        required:true,
        unique:true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        default: 'images/profilePics/default.jpeg' //served at http://localhost:3000/images/profilePics/default.jpeg
    }
    // posts = [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'User'
    // }]
}, {timestamps:true}
);

User.plugin(passportLocalMongoose);

var User = mongoose.model('User', User);

module.exports = User

