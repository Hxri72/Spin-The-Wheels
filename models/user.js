const mongoose = require('mongoose')

const Schema = mongoose.Schema

let couponSchema = new Schema({
    couponId : {
        type:String,
        required:true
    },
    couponName : {
        type:String,
        required:true
    },
    couponCode:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
    minAmount:{
        type:String,
        required:true
    },
    maxAmount:{
        type:String,
        required:true
    },
    expiryDate:{
        type:String,
        required:true
    }

})

let addressSchema = new Schema({
    Address : {
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    Phone:{
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    Postcode:{
        type:String,
        required:true
    }
})

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
    Password:{
        type : String,
        required : true
    },
    userStatus:{
        type:String,
        required:true
    },
    coupons: [couponSchema],

    Address : [addressSchema]

})

module.exports = mongoose.model('user',userSchema)