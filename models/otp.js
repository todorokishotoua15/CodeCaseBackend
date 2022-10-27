const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const Otp = new Schema({
    data: {
        type: String,
    },
    email: {
        type: String
    }
})

var OTP = mongoose.model('Otp', Otp);
module.exports = OTP;