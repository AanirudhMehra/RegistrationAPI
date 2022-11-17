// var nodemailer = require('nodemailer');
// const otpGenerator = require('otp-generator');
// const User  = require("../model/userSchema");

// var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
// var transporter = nodemailer.createTransport(
//     {
//         service : 'gmail',
//         auth:{
//             user:'aanirudhmehra@gmail.com',
//             pass:'ziqeywmoahinyznr'
//         }
//     }
// )

// var mailOptions = {
//     from:'aanirudhmehra@gmail.com',
//     to: email,
//     subject:"Verify your Email",
//     html: <p> Enter <b>${otp}</b> in the website to verify your email address and complete the signup . The OTP will expire in one hour.</p>

// }

// transporter.sendMail(mailOptions,function(error,info){
//     if(error){
//         console.log(error)
//     }else{
//         console.log("email sent " + info.response)
//     }
// })

//  module.exports = otp ;