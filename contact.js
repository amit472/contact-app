
const mongoose = require('mongoose');
var promise = require('bluebird');
promise.promisifyAll(mongoose);

var contactList = new mongoose.Schema({
    email:{
        type: String,
        trim: true,
        required: true,
        minlength: 1,
    
    },
    
    name:{
        type: String,
        required: true,
        minlength: 1
        },
    
    number:{
        type: Number,
        minlength: 1
    },
    admin:{
        type:String
    }
});

var contact = mongoose.model('contact',contactList);

module.exports={contact};