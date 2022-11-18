const mongoose = require("mongoose");
const userPasswordSchema = new mongoose.Schema({
    passwordresetemail: {
        type: String , 
        required: true
    }    
})
const userpasswordsend  = mongoose.model("userpasswordsend" , userPasswordSchema );

module.exports = userpasswordsend;