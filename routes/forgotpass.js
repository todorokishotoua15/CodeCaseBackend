var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
require("dotenv").config();
var OTP = require('../models/otp');

const nodemailer = require('nodemailer');



function generateOTP() {
          
    // Declare a string variable 
    // which stores all string
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let OTP = '';
      
    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 6; i++ ) {
        OTP += string[Math.floor(Math.random() * len)];
    }
    return OTP;
}

router.post('/', function(req,res,next) {
    var username = req.body.username;
    var email = req.body.email;
    var c = true;
    console.log(username);
    User.findOne({username: username}).then((user)=> {
        if (user.email === email) {
            c = true;
        }
    }, (err)=> next(err))
    .catch((err) => {
        console.log(err);
    })

    if (!c) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.send({err : "User does not exists"})
    }

    else {

        console.log(process.env.username);

        let transporter = nodemailer.createTransport({

            host: "smtp.gmail.com",
            auth: {
                user: "codecase710@gmail.com",
                pass: "tdrpmoceddmpbwgb",
            },

        });
        var otp = generateOTP();
        let data =  transporter.sendMail({

            from: "codecase710@gmail.com",
            to: email,
            subject: "Reset Password",
            text: "Your One time password is : " + otp,

        }).then((result)=>{
            console.log("Messane sent!");

            var currdate = new Date();
            currdate.setDate(currdate.getDate() + 1);
            console.log(currdate);
            OTP.create(new OTP({
                data: otp,
                email: email,
                "expireAt": currdate
            })).then((otp1) => {
                console.log("OTP stored in database succesfully!");
            }).catch((err) => {
                console.log(err);
            })

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.send({otp : otp});

        }).catch((err) => {

            console.log(err);
            res.statusCode = 500;
            res.send(err);

        })
    }

});

router.post('/validate', function(req,res1,next) {
    var otp = req.body.otp;
    var email = req.body.email;
    console.log(req.body);
    OTP.findOne({data: otp, email: email})
        .then((result) => {
            console.log(otp, result.data);
            res1.statusCode = 200;
            res1.setHeader('Content-Type', 'application/json');
            res1.send({validation: "success"});
            
        }).catch((err)=> {
            res1.statusCode = 500;
            res1.setHeader('Content-Type', 'application/json');
            res1.send({validation: "failed"});
        })
});

router.post('/changepass', function(req,res,next) {
    var problems, firstname, lastname, rating;

    var proceed = 0;

    User.findOne({username: req.body.username})
        .then((user)=> {
            console.log(user);
            problems = user.problems;
            firstname = user.firstname;
            lastname = user.lastname;
            rating = user.rating;

            console.log(problems);

            user.remove().then((res2)=>{
                console.log("user removed successfully!");
                User.register({ problems: problems, 
                            username: req.body.username, 
                            firstname: firstname,
                            lastname: lastname,
                            rating: rating}, req.body.password)
                .then((res1)=> {
                    console.log(res1);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.send({creation : "success!"});
                }).catch((err) => {
                    console.log(err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.send({creation: "failed"});
                })
            }).catch((err) => {
                console.log("There was an error in removing the user!");
                console.log(err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.send({creation: "failed"});
            })
        }).catch((err)=>{
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.send({creation: "failed"});
        })
    
})

module.exports = router;