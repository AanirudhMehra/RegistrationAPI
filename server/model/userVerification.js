const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const userOTPVerifyschema = new Schema({
    userID : String,
    otp: String,
    createdAt : Date,
    expiresAt: Date
});

const userOTPVerify = mongoose.model("userOTPVerify" , userOTPVerifyschema );

module.exports = userOTPVerify;