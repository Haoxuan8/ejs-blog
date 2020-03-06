var mongoose =require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//TODO: improve the structure
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true
        // validate:
    },
    password: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        lowcase: true
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    }
    });

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;