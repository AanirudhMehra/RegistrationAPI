const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
dotenv.config({ path: './config.env'});
require('./db/conn');
const port = process.env.PORT || 3000;
// const USER = require('./model/userSchema');

app.use(express.json());

app.use(require('./router/auth'));



app.get('/login', (req ,res) => {
    res.send(`Please Login to continue.`);
});

app.get('/register', (req ,res) => {
    res.send(`Please sign up to continue.`);
});

app.get('/verifyOTP', (req ,res) => {
    res.send(`Please sign up to continue.`);
});

app.listen(port , () => {
    console.log(`Server is running at port number 3000`);
})