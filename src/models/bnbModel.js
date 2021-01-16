const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

let BnbSchema = new Schema({
    "title": {
        type: String,
        required: true
    },
    "type":{
        type: String,
        required: true
    },
    "guests": {
        type: Number,
        required: true
    },
    "bedrooms": {
        type: Number,
        required: true
    },
    "baths": {
        type: Number,
        required: true
    },
    "description": {
        type: String,
        required: true
    },
    "price": {
        type: Number,
        required: true
    },
    "amenities": {
        type: Array,
        required: true
    },
    "location": {
        type: Object,
        required: true
    },
    "favorite": {
        type: Boolean
    },
    "booked": {
        type: Boolean
    },
    "photos": {
        type: Array
    }
    ,
    "owner": {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});
const BnB = mongoose.model("BnB",BnbSchema);
module.exports = BnB;