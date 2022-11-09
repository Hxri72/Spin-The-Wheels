const mongoose = require('mongoose')

const Schema = mongoose.Schema

let productSchema = new Schema ({
    productId:{
        type:String,
        required:true
    },
    productname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    productImg:{
        type:Array,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
    
})

let addressSchema = new Schema ({
        Fullname : {
            type : String,
            required:true
        },
        Address : {
            type : String,
            required:true
        },
        District : {
            type : String,
            required : true
        },
        Phone : {
            type:String,
            required : true
        },
        State : {
            type:String,
            required : true
        },
        Post : {
            type : String,
            required : true
        }
})

let OrderSchema = new Schema ({
    UserId:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMode : {
      type:String,
      required:false  
    },
    paymentStatus : {
        type : String,
        required:false
    },

    Products:[productSchema],

    Address : [addressSchema]
})

module.exports = mongoose.model('Order',OrderSchema)