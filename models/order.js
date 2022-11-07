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

    Products:[productSchema],

    Address : [addressSchema]
})

module.exports = mongoose.model('Order',OrderSchema)