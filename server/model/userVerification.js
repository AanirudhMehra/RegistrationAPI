const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const userOTPVerifyschema = new Schema({
    // verifyemail : String, // userID : String,
    verifyotp: {
        type : String,
        required : true
    }
    
    
    
});

const userOTPVerify = mongoose.model("userOTPVerify" , userOTPVerifyschema );

module.exports = userOTPVerify;