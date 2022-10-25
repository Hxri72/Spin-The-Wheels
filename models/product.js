const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema ({
    productname:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    quantity:{
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
    productStatus:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('product',productSchema)