const mongoose = require('mongoose')

const Schema = mongoose.Schema

let newsSchema = new Schema ({
    Headline:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    NewsImg:{
        type:Array,
        required:true
    },
})

module.exports = mongoose.model('news',newsSchema)