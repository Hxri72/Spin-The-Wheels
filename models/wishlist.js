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
    }
})

let wishlistSchema = new Schema ({
    UserId : {
        type:String,
        required:true
    },
    products : [productSchema]
})



module.exports = mongoose.model('wishlist',wishlistSchema)