var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema({
    username: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:True
    },
    image:{
        type:String,
        default: 'default.jpeg'
    },
    posts = [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
}, {timestamps:true}
);

User.plugin(passportLocalMongoose);

var User = mongoose.model('User', User);

module.exports = User

