const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
var bodyParser = require('body-parser');
const authenticate = require("../middleware/authenticate");
const app = express()
var cors = require('cors');



require('../db/conn');
const User  = require("../model/userSchema");
const userOTPVerify = require("../model/userVerification");
const userpasswordsend = require("../model/userPassword");
const mail = "aanirudhmehra@gmail.com"
//  const otp = require('./otp.js');
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})
app.use(bodyParser.urlencoded({ extended : true}));
var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
router.get('/' , (req,res)=>{
    res.send(`Hello world from the server router js`);
});

router.post('/register' , async (req , res)=>{
    const { email , password , cpassword } = req.body;
    if(!email || !password || !cpassword) {
        return res.status(422).json({error: "Please fill the required fields properly"});
    }

    try{ 
        const userExist = await User.findOne({ email : email })
        if (userExist) {
            return res.status(422).json({
                error: "Email already Exists"
            });
        } else if(password != cpassword){
            return res.status(422).json({
                error: "The password fields do not match"
            });
        } else {
            const user = new User({ email , password , cpassword});
            

            await user.save();
            // var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
            // console.log(otp);
            var transporter = nodemailer.createTransport(
                {
                    service : 'gmail',
                    auth:{
                        user:'aanirudhmehra@gmail.com',
                        pass:'ziqeywmoahinyznr'
                    }
                }
            )
            // const { email , password , cpassword } = req.body;
            // const userExist =  User.findOne({ email:email })
            var mailOptions = {
                from:'aanirudhmehra@gmail.com',
                to: email ,
                subject:"Verify your Email",
                text:  otp
            } ; 
            
            // const saltRounds = 10;
            
            // const hashedOTP =  bcrypt.hash(otp , saltRounds);
            
            
            const newOTPverify = new userOTPVerify({
                
               verifyotp :otp,
    
            })

            // const passwordreset = new userpasswordsend({
            //     passwordresetemail : email
            // })
            
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                }else{
                    console.log("email sent " + info.response)
                }
            });
            
            
          
            res.status(201).json({ message : " user registered successfully"});



//             var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
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
//     to: 'aanirudhmehra@gmail.com',
//     subject:"Verify your Email",
//     text:  otp
// } ; 

// const saltRounds = 10;

// const hashedOTP =  bcrypt.hash(otp , saltRounds);

// const newOTPverify = new userOTPVerify({
//     userID: "_id" ,
//     otp: hashedOTP,
//     createdAt : Date.now(),
//     expiresAt : Date.now() + 3600000
// })

// transporter.sendMail(mailOptions,function(error,info){
//     if(error){
//         console.log(error)
//     }else{
//         console.log("email sent " + info.response)
//     }
// })


            // await((result) => {
            //     sendVerificationOTP(result,res);
            //     console.log("Hello")
            // })
        }
            
  
        

        

    

    } catch(err) {
        console.log(err);

    }

    

}); 

// // var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
// const email = req.body.email 
// User.find({ email: email });

// User.then((user) => {
//     console.log(email);
    
//       });



// var sendVerificationOTP = async({_id, email}, res)=>{
//     try{
//         var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
//         var transporter = nodemailer.createTransport(
//             {
//                 service : 'gmail',
//                 auth:{
//                     user:'aanirudhmehra@gmail.com',
//                     pass:'ziqeywmoahinyznr'
//                 }
//             }
//         )
        
//         var mailOptions = {
//             from:'aanirudhmehra@gmail.com',
//             to: req.body.email,
//             subject:"Verify your Email",
//             text:  otp
//         } ; 
        
//         const saltrounds = 10;
        
//         const hashedOTP = await bcrypt.hash(otp , saltRounds);
        
//         const newOTPverify = await new userOTPVerify({
//             userID: _id ,
//             otp: hashedOTP,
//             createdAt : Date.now(),
//             expiresAt : Date.now() + 3600000
//         });

//         await newOTPverify.save();
        
//         await transporter.sendMail(mailOptions,function(error,info){
//             if(error){
//                 console.log(error)
//             }else{
//                 console.log("email sent " + info.response)
//             }
//         })
        

//     } catch (error) {
//         console.log(error);
//     }
// }
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
// // const { email , password , cpassword } = req.body;
// const userExist =  User.findOne({ email:email })
// var mailOptions = {
//     from:'aanirudhmehra@gmail.com',
//     to: User.email,
//     subject:"Verify your Email",
//     text:  otp
// } ; 

// const saltRounds = 10;

// const hashedOTP =  bcrypt.hash(otp , saltRounds);

// const newOTPverify = new userOTPVerify({
//     userID: "_id" ,
//     otp: hashedOTP,
//     createdAt : Date.now(),
//     expiresAt : Date.now() + 3600000
// })

// transporter.sendMail(mailOptions,function(error,info){
//     if(error){
//         console.log(error)
//     }else{
//         console.log("email sent " + info.response)
//     }
// });



router.post('/Login' , async (req , res)=> {
try{
    let token;
    const { email , password } = req.body;

    if(!email || !password) {
        return res.status(400).json({error:"Please fill all the fields"});

    }

    const userLogin = await User.findOne({ email : email });

    // console.log(userLogin);

    if (userLogin) {
        const isMatch = await bcrypt.compare(password , userLogin.password); 
        const token  =  await userLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken" , token , {
            expires: new Date(Date.now() + 25892000000),
            httpOnly:true
        });
    
    
    if (!isMatch) {
        res.status(400).json({error: "Incorrect Credentials of your password "});
   
    } else {
  
        res.json({ message: "User signed in successfully"});
    }
 } else {
    res.status(400).json({ error : "Email does not match with each other"});
 }
 } 
 
 catch (err) {
    console.log(err);
}
});

router.post('/verifyOTP' , async (req,res)=>{
    try{
        
        let {verifyotp } = req.body;
        
        // let validOTP = await bcrypt.compare(otp, hashedOTP);

        if ( !verifyotp) {
            throw Error("Empty OTP details are not allowed")
        }
        // } else {
        //     const records = await userOTPVerify.find({
        //         // userID,
                
        //     });
        //     if (records.length <=0 ){
        //         throw new Error("Account record doesnt exiat or has been verified already. Please log in");
        //     } else {
                // const validOTP = await bcrypt.compare(otp, hashedOTP);
                else if (otp != verifyotp){  
                    throw new Error("Invalid code passed. Check your inbox");
                } else {
                        
                            res.status(401).json({
                                msg: "You are fully verified",
                   });
                    
                } 
            }
         catch (error) {
        
        console.log(error);
         };

    });
    router.post("/forgot-password", async(req,res) => {
        try{
            const {email} = req.body;
            const {password} = req.body;
            const passwordreset = new userpasswordsend({
                passwordresetemail : email
            })
            let{passwordresetemail} = req.body;
            console.log(passwordresetemail);
            if(!passwordresetemail){
                throw Error("Empty email details are not allowed")
            } else if(email != passwordresetemail) {
                throw new Error("Invalid email passed. Check your inbox");
                
            } else{
                var transporter = nodemailer.createTransport(
                    {
                        service : 'gmail',
                        auth:{
                            user:'aanirudhmehra@gmail.com',
                            pass:'ziqeywmoahinyznr'
                        }
                    }
                )
                var mailOptions = {
                    from:'aanirudhmehra@gmail.com',
                    to: email ,
                    subject:"Your old password",
                    text:  password
            }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                }else{
                    console.log("email sent " + info.response)
                }
            });
        }
        } catch (err) {
            console.log(err);
        }
    });
     
  
  
  router.get('/logout' , authenticate , function(req , res){
      req.user.deleteToken(req.token,(err , user)=>{
          if(err) {
              console.log(err);
              return res.status(400).send(err);
              res.sendStatus(200);}
          })
      });
     
  
  console.log("Reached the end of the program");
  
  
  module.exports = router;

// });
