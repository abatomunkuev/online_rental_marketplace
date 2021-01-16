const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

let UserSchema = new Schema({
    "username": {
        type: String,
        unique: true,
        required: true
    },
    "email": {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    "firstName": {
        type: String,
        required: true,
        trim: true
    },
    "lastName": {
        type: String,
        required: true,
        trim: true
    },
    "password": {
        type: String,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    "isAdmin": {
        type: Boolean,
        default: false
    },
    "certified": {
        type: Boolean,
        default: false
    }
    ,
    "tokens": [{
        token: {
            type: String,
            required: true
        }
    }],
    "bookedRooms": [{
        bookedRoom: {
            type: Object
        }
    }]
}, {
    timestamps: true
});

UserSchema.virtual('mybnbs',{
    ref: 'BnB',
    localField: '_id',
    foreignField:'owner'
});

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({"_id": user._id.toString() }, 'webproject');

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

UserSchema.statics.findByCredentials = async (username,password) => {
    const user = await User.findOne({username});
    if(!user) {
        throw new Error('Sorry, you entered the wrong username and/or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Sorry, you entered the wrong username and/or password');
    }
    return user;
}


// Hash the plain text password before saving
UserSchema.pre('save',async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,10);
    }
    next();
})

const User = mongoose.model("Users", UserSchema);
module.exports = User;