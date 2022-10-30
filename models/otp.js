const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const Otp = new Schema({
    data: {
        type: String,
    },
    email: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
})

var OTP = mongoose.model('Otp', Otp);
module.exports = OTP;