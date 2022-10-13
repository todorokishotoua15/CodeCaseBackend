const mongoose= require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    admin : {
        type: Boolean,
        default: false
    },
    problems: {
        type: Array,
        default: []
    },
    firstname: {
        type: String,
        required : true
    },
    lastname: {
        type: String,
        required: true
    },
    rating : {
        type: Number,
        required: true
    }
});

User.plugin(passportLocalMongoose);

var Users = mongoose.model('User', User);
module.exports = Users;