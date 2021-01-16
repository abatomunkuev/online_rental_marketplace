const express = require('express');
const nodemailer = require("nodemailer");
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "569356954732-7edivrfjk2cjbqv73uhd9b38ejb4r6nd.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const router = express.Router();
var UserModel = require('../models/UserModel');
var BnBModel = require('../models/bnbModel');
const auth = require('../middleware/auth');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: 'umbrellabnb',  
        pass: 'umbrellabnbweb'  
    }
});


// setup registration page 
router.get('/registration', (req,res) => {
    res.render('registration', {
        layout: false
    });
})

// setup registration user form 
router.post('/registration',async (req,res) => {
    const FORM_DATA = req.body;
    const googleToken = FORM_DATA.idtoken;
    let userData = {
        username: FORM_DATA.email,
        firstName: FORM_DATA.fname,
        lastName: FORM_DATA.lname,
        password: FORM_DATA.pass,
        isAdmin: false,
        certified: false
    }
    async function registerUser() {
        var User = new UserModel({
            username: userData.username,
            email: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: userData.password,
            isAdmin: userData.isAdmin,
            certified: userData.certified
        });
        try {
            await User.save()
            .then((response)=>{
                //console.log(response)
                console.log("User was saved")
                UserModel.findOne({ username: userData.username})
                .exec()
                .then(async (user) => {
                    if(!user) {
                        console.log('The user could not be found');
                    } else {
                        //console.log(user);
                        const token = await user.generateAuthToken();
                        //console.log(token);
                        req.session.user = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            isAdmin: user.isAdmin,
                            token
                        };
                        res.redirect('/dashboard');
                    }
                    var mailOptions = {
                        from: 'umbrellabnb@gmail.com',
                        to: userData.username,
                        subject: 'Thank you for registering',
                        html: '<p>Hello ' + userData.fname + ",</p><p>Thank you for registering.</p>"
                    }
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log("ERROR: " + error);
                        } else {
                            console.log("SUCCESS: " + info.response);
                        }
                    });
                })
            })
            .catch((err)=>{
                let passwordError = null;
                let emailError = null;
                if(err.code == 11000) {
                    emailError = 'User is already exists';
                } else {
                    err.message = err.message.replace('Users validation failed: password: ','');
                    if (err.message.includes('Password')) {
                        passwordError = err.message;
                    } else {
                        emailError = err.message;
                    }
                }
                res.render('registration', {
                    errorEmailMsg: emailError,
                    errorPassMsg: passwordError,
                    layout:false
                });
            })
        } catch (e) {
            console.log(e);
        }
        
    }
    if(googleToken) {
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            console.log(payload);
            userData.username = payload.email;
            userData.firstName = payload.given_name;
            userData.lastName = payload.family_name;
            userData.password = '';
        }
        verify().then(() => {
            console.log('register google user')
            registerUser();
            res.redirect('/dashboard');
        }).catch((error) => {
            console.log(error);
        });
    } else {
        registerUser();
    }
})
// setup login 
router.post("/login",async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username == "" || password == "") {
        req.flash('error',"Both fields needs to be required!" );
        res.redirect('back')
    }
    try {
        const user = await UserModel.findByCredentials(username,password);
        const token = await user.generateAuthToken();
        req.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            token
        };
        res.status(200).send(user);
    } catch(e) {
        res.status(400).json({ error: e.toString()});
    }
});

router.get('/logout', auth, async (req,res) => {
    try {
        const user = await UserModel.findOne({ _id: req.user._id});
        user.tokens = user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await user.save();
        //console.log(user);
        req.session.reset();
        res.redirect('back');
    } catch(e) {
        console.log(e);
    }
})

router.get('/dashboard', auth, async (req,res) => {
    const  bookedRooms = await BnBModel.find({_id: req.user.bookedRooms}).lean().exec();
    BnBModel.find({}).lean().exec()
    .then((bnbs) => {
        res.render('dashboard', {
            bookedRooms: bookedRooms,
            rooms: bnbs,
            data: req.user,
            layout: false
        });
    }).catch((error) => {
        console.log(error);
    })
});

module.exports = router;

