const mongoose = require('mongoose')

const Schema = mongoose.Schema

let bannerSchema = new Schema ({
    Section:{
        type:String,
        required:true
    },
    bannerImg:{
        type:Array,
        required:true
    },
    bannerStatus : {
        type:String,
        required:true
    }
})

module.exports = mongoose.model('banner',bannerSchema)