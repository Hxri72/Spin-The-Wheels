const mongoose = require('mongoose')

const Schema = mongoose.Schema

let userSchema = new Schema({
    Fullname:{
        type : String,
        required : true
    },
    Email:{
        type : String,
        required : true
    },
    Phone:{
        type : String,
        required : true
    },
    Address:{
        type:String,
        required: false
    },
    Password:{
        type : String,
        required : true
    },
    userStatus:{
        type:String,
        required:true
    },

})

module.exports = mongoose.model('user',userSchema)