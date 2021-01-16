const express = require('express');
const multer = require("multer");
const path = require("path");
require('dotenv').config()
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const fs = require('fs');
const moment = require('moment');
//const sharp = require('sharp');
const openGeocoder = require('node-open-geocoder');
var BnBModel = require('../models/bnbModel');
var UserModel = require('../models/UserModel');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerHelper } = require('hbs');

// email setup
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.EMAIL_USER,  //your email account
        pass: process.env.EMAIL_PASS  // your password
    }
});


// .concat({ token })
// Setup multer for photos
//create storage properties
const STORAGE = multer.diskStorage({
    destination: "./public/img/rooms",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
// Filter files with multer
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Not an image! Please upload only images.", false);
    }
};
const UPLOAD = multer({ 
    storage: STORAGE,
    fileFilter: multerFilter
});

router.post('/search',(req,res) => {
    //console.log(req.body);
    let checkIN = req.body.checkIn;
    let checkOUT = req.body.checkOut;
    checkIN = moment(checkIN).format('Do MMM YYYY');
    checkOUT = moment(checkOUT).format('Do MMM YYYY');
    let searchRequest = {
        checkIN,
        checkOUT,
        location:req.body.location
    }
    BnBModel.find({"location.city": req.body.location}).lean().exec()
    .then((bnbs) => {
        //console.log(bnbs);
        res.render('searchListings', {
            user:req.session.user,
            request: searchRequest,
            data: bnbs,
            layout: false
        });
    }).catch((error) => {
        console.log(error);
    })
});
// setup listings page
router.get('/rooms',async (req,res) => {
    if(req.query.typePlaceSelect && !req.query.sortSelect) {
        const bnbType = req.query.typePlaceSelect
        const message = `${bnbType}s`
        BnBModel.find({type: bnbType}).lean().exec()
        .then((bnbs) => {
            //console.log(bnbs);
            res.render('roomListings', {
                message: message,
                rooms: bnbs,
                user: req.session.user,
                layout:false
            });
        })
        .catch((error) => {
            //res.status(500).send(error);
            console.log(error);
        })
    } else if (!req.query.typePlaceSelect && req.query.sortSelect) {
        //console.log(req.query.sortSelect)
        const sortBy = req.query.sortSelect;
        const message = sortBy == 'expensive' ? 'Sorted by most expensive' : 'Sorted by most cheapest';
        if(sortBy == 'expensive') {
            BnBModel.find({}).sort({price: -1}).lean().exec()
            .then((bnbs) => {
                //console.log(bnbs);
                res.render('roomListings', {
                    message: message,
                    rooms: bnbs,
                    user: req.session.user,
                    layout:false
                });
            })
            .catch((error) => {
                //res.status(500).send(error);
                console.log(error);
            })
        } else {
            BnBModel.find({}).sort({price: 1}).lean().exec()
            .then((bnbs) => {
                //console.log(bnbs);
                res.render('roomListings', {
                    message: message,
                    rooms: bnbs,
                    user: req.session.user,
                    layout:false
                });
            })
            .catch((error) => {
                //res.status(500).send(error);
                console.log(error);
            })
        }
    }  else if (req.query.typePlaceSelect && req.query.sortSelect) {
        const bnbType = req.query.typePlaceSelect
        const sortBy = req.query.sortSelect
        const message = sortBy == 'expensive' ? `${bnbType}s, sorted by most expensive` : `${bnbType}s, sorted by most cheapest`
        if(sortBy == 'expensive') {
            BnBModel.find({type: bnbType}).sort({price: -1}).lean().exec()
            .then((bnbs) => {
                //console.log(bnbs);
                res.render('roomListings', {
                    message: message,
                    rooms: bnbs,
                    user: req.session.user,
                    layout:false
                });
            })
            .catch((error) => {
                //res.status(500).send(error);
                console.log(error);
            })
        } else {
            BnBModel.find({type: bnbType}).sort({price: 1}).lean().exec()
            .then((bnbs) => {
                //console.log(bnbs);
                res.render('roomListings', {
                    message: message,
                    rooms: bnbs,
                    user: req.session.user,
                    layout:false
                });
            })
            .catch((error) => {
                //res.status(500).send(error);
                console.log(error);
            })
        }
    } else {
        const message = "Places nearby";
        BnBModel.find({}).lean().exec()
        .then((bnbs) => {
            //console.log(bnbs);
            res.render('roomListings', {
                message: message,
                rooms: bnbs,
                user: req.session.user,
                layout:false
            });
        })
        .catch((error) => {
            //res.status(500).send(error);
            console.log(error);
        })
    }

})
/*
router.post('/rooms', async(req,res) => {
    //console.log(req.body);
    if(req.body.typePlaceSelect) {
        const bnbType = req.body.typePlaceSelect
        BnBModel.find({type: bnbType}).lean().exec()
        .then((bnbs) => {
            console.log(bnbs);
            res.render('roomListings', {
                rooms: bnbs,
                user: req.session.user,
                layout:false
            });
        })
        .catch((error) => {
            //res.status(500).send(error);
            console.log(error);
        })
    }
})
*/
router.post('/book/:id', auth, async (req,res) => {
    const _id = req.params.id;
    const bnb = await BnBModel.findByIdAndUpdate(_id, {
        booked: true
    }).lean().exec()
    const user =  await UserModel.findOne({ _id: req.user._id});
    // console.log(bnb);
    let bnbID = bnb._id;
    //console.log(bnbID);
    user.bookedRooms.push(bnbID);
    await user.save();
    const id = crypto.randomBytes(5).toString("hex");
    let checkIn = moment(req.body.checkIn);
    let checkOut = moment(req.body.checkOut);
    let difference = checkOut.diff(checkIn,'days');
    let total = difference * bnb.price;
    var mailOptions = {
        from: 'umbrellabnb@gmail.com',
        to: user.username,
        subject: 'Thank you for registering',
        html: '<p>Hello ' + user.firstName + ",</p><p>Thank you for booking.</p>"
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log("SUCCESS: " + info.response);
        }
    });
    res.render('confirmation', {
        reservation_id: id.toUpperCase(),
        total: total,
        user: req.session.user,
        room: bnb,
        layout: false
    })
})

router.get('/rooms/:id', async (req,res) => {
    const _id = req.params.id;
    //console.log(_id);
    // Example
    try {
        const bnb = await BnBModel.findById(_id).lean().exec();

        if(!bnb) {
            return res.status(404).send();
        }
        res.render('room', {
            user: req.session.user,
            room: bnb,
            layout: false
        });
    } catch(e) {
        //res.status(500).send();
    }
})

router.get('/listings', (req,res) => {
    res.render('roomListings', {
        user: req.session.user,
        layout: false
    });
})
// Setup add room
router.get('/roomAdd',auth, (req,res) => {
    res.render('roomAdd', {
        layout:false
    })
})

// Setup add room post
router.post('/roomAdd',auth, (req,res) => {
    const FORM_DATA = req.body;
    try {
        openGeocoder()
        .geocode(FORM_DATA.address)
        .end((err, result) => {
            let lat;
            let lon;
            if(err) {
                lat = 43.6685404;
                lon =  -79.4047039;
            }
            else if (result) {
                //console.log(res);
                //console.log(result);
                lat = result[0].lat;
                lon = result[0].lon;
                const address = result[0].address;
                console.log(address);
                const display_name = result[0].display_name;
                var BnB = new BnBModel({
                    title: FORM_DATA.title,
                    type: FORM_DATA.type,
                    guests: Number(FORM_DATA.guests),
                    bedrooms: Number(FORM_DATA.bedrooms),
                    baths: Number(FORM_DATA.baths),
                    description: FORM_DATA.description,
                    price: FORM_DATA.price,
                    amenities: FORM_DATA.amenities,
                    location: {
                        address: display_name,
                        city: FORM_DATA.city,
                        lat: lat,
                        lon: lon,
                        state: address.state,
                        country: address.country
                    },
                    favorite: false,
                    booked: false,
                    photos: [],
                    owner: req.user._id
                });
                try {
                    BnB.save()
                    .then((response) => {
                        console.log('BnB was saved');
                        BnBModel.findOne({title: FORM_DATA.title})
                        .exec()
                        .then((bnb) => {
                            if(!bnb) {
                                console.log('BnB can not be found');
                            } else {
                                console.log(bnb);
                                req.session.room = {
                                    roomID: bnb._id
                                }
                                res.redirect('/uploadPhoto');
                                res.redirect('/dashboard');
                            }
                        })
                    })
                    .catch((e) => {
                        console.log(e);
                    })
                } catch(e) {
                    console.log(e);
                }
            } else {
                res.render('roomEdit', {
                    layout: false,
                    error: 'Please provide the correct address'
                })
            }
            });
    } catch(e) {
        res.render('roomEdit', {
            layout: false,
            error: 'Please provide the correct address'
        })
    }
})

router.get('/roomEdit/:id', auth,async (req,res) => {
    try {
        BnBModel.findById(req.params.id).lean().exec()
        .then((bnb) => {
            console.log(bnb);
            res.render('roomEdit', {
                room: bnb,
                layout:false
            });
        }).catch((error) => {
            console.log(error);
        })

    } catch(error) {
        console.log(error);
    } 
})

router.post('/roomEdit/:id', auth, async (req,res) => {
    const FORM_DATA = req.body;
    try {
        openGeocoder()
        .geocode(FORM_DATA.address)
        .end(async (err, result) => {
            let lat;
            let lon;
            if(err) {
                lat = 43.6685404;
                lon =  -79.4047039;
            }
            else if (result) {
                //console.log(res);
                console.log(result);
                lat = result[0].lat;
                lon = result[0].lon;
                const address = result[0].address;
                console.log(address);
                const display_name = result[0].display_name;
                const bnb = await BnBModel.findByIdAndUpdate(req.params.id, {
                    title: FORM_DATA.title,
                    type: FORM_DATA.type,
                    guests: Number(FORM_DATA.guests),
                    bedrooms: Number(FORM_DATA.bedrooms),
                    baths: Number(FORM_DATA.baths),
                    description: FORM_DATA.description,
                    price: FORM_DATA.price,
                    amenities: FORM_DATA.amenities,
                    location: {
                        address: display_name,
                        city: FORM_DATA.city,
                        lat: lat,
                        lon: lon,
                        state: address.state,
                        country: address.country
                    },
                });
                res.redirect('/dashboard');
        } else {
            res.render('roomEdit', {
                layout: false,
                error: 'Please provide the correct address'
            })
        }
    });
    } catch(e) {
        console.log(e);
        res.render('roomEdit', {
            layout: false,
            error: 'Please provide the correct address'
        })
    }
})

// Setup delete bnb
router.get("/delete/:roomId",auth,async (req, res) => {
    const roomID = req.params.roomId;
    //console.log(roomID)
    try {
        const bnb = await BnBModel.findByIdAndDelete(roomID);
        console.log(bnb);
        bnb.photos.forEach((photo) => {
            fs.unlink(`./public/${photo}`, (err) => {
                if (err) throw err;
                console.log(`${photo} was deleted`);
            });
        });
        res.redirect('/dashboard');
    } catch(e) {
        console.log(e);
    }
});

router.get('/uploadPhoto', auth,(req,res) => {
    res.render('uploadPhoto', {
        user: req.session.user,
        layout:false
    })
})


router.post('/uploadphotos', auth,UPLOAD.array('photos',5), async (req,res,next) => {
    let files = req.files;
    let photoPaths = [];
    console.log(files);
    files.forEach((file) => {
        file.path = file.path.replace('public','');
        photoPaths.push(file.path);
    });
    const bnb = await BnBModel.findOne({ _id: req.session.room.roomID});
    bnb.photos = photoPaths;
    await bnb.save();
    res.redirect('/dashboard');
})


// setup room page
router.get('/room', (req,res) => {
    res.render('room', {
        user: req.session.user,
        layout: false
    });
})


// setup confirmation page
router.get('/confirmation', auth, (req,res) => {
    res.render('confirmation', {
        layout: false
    });
})



module.exports = router;
/*
fs.unlink('path/file.txt', (err) => {
    if (err) throw err;
    console.log('path/file.txt was deleted');
});
*/