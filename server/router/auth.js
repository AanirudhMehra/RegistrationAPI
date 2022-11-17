const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
var bodyParser = require('body-parser');
const authenticate = require("../middleware/authenticate");
const app = express()
app.use(bodyParser.urlencoded({ extended : true}));

require('../db/conn');
const User  = require("../model/userSchema");
const userOTPVerify = require("../model/userVerification");
const mail = "aanirudhmehra@gmail.com"
//  const otp = require('./otp.js');

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

            res.status(201).json({ message : " user registered successfully"});

            await((result) => {
                sendVerificationOTP(result,res)
            })
        }
            
  
        

        

    

    } catch(err) {
        console.log(err);

    }

    

}); 

var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
var sendVerificationOTP = async({_id, email}, res)=>{
    try{
        var otp = otpGenerator.generate(6,{upperCaseAlphabets: false , specialChars: false});
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
            to: req.body.email,
            subject:"Verify your Email",
            text:  otp
        } ; 
        
        const saltrounds = 10;
        
        const hashedOTP = await bcrypt.hash(otp , saltRounds);
        
        const newOTPverify = await new userOTPVerify({
            userID: _id ,
            otp: hashedOTP,
            createdAt : Date.now(),
            expiresAt : Date.now() + 3600000
        });

        await newOTPverify.save();
        
        await transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("email sent " + info.response)
            }
        })
        

    } catch (error) {
        console.log(error);
    }
}
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
        let {userID ,otp } = req.body;
        if (!userID || !otp) {
            throw Error("Empty OTP details are not allowed")
        } else {t
            const records = await userOTPVerify.find({
                userID,
            });
            if (records.length <=0 ){
                throw new Error("Account record doesnt exiat or has been verified already. Please log in");
            } else {
                const validOTP = await bcrypt.compare(otp, hashedOTP);
                if (!validOTP) {
                    throw new Error("Invalid code passed. Chcek your inbox");
                } else {
                    await user.updateOne({
                        _id: userID
                    }, {
                        verified: true
                    });

                    userOTPVerify.deleteMany({userID});
                    res.json({
                        status:"Email has been verified"
                    })
                }
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",

        })
    }
});

app.get('/logout' , authenticate , function(req , res){
    req.user.deleteToken(req.token,(err , user)=>{
        if(err) {
            console.log(err);
            return res.status(400).send(err);
            res.sendStatus(200);}
        })
    });
   

// router.get('/about' ,authenticate , (req , res)=>{
//     console.log("Hello my About");
//     res.send("Hello About world from the server");
// });


module.exports = router;