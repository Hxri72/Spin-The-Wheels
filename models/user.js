const mongoose = require('mongoose')

const Schema = mongoose.Schema

let userSchema = new Schema({
    firstname:{
        type : String,
        required : true
    },
    lastname:{
        type : String,
        required : true
    },
    Email:{
        type : String,
        required : true
    },
    Password:{
        type : String,
        required : true
    },
    userStatus:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('user',userSchema)