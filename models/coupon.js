const mongoose = require('mongoose')

const Schema = mongoose.Schema

let couponSchema = new Schema ({
    CouponName:{
        type:String,
        required:true
    },
    CouponCode:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    Percentage:{
        type:String,
        required:true
    },
    Minamount:{
        type:String,
        required:true
    },
    Maxamount:{
        type:String,
        required:true
    },
    ExpiryDate:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('coupon',couponSchema)