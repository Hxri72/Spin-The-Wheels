const mongoose = require('mongoose')

const Schema = mongoose.Schema

let destinationSchema = new Schema ({
    Route:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    },
    CommonRoute:{
        type:String,
        required:true
    },
    RidingDistance:{
        type:String,
        required:true
    },
    BestRidingSeason:{
        type:String,
        required:true
    },
    RouteImg:{
        type:Array,
        required:true
    }
})

module.exports = mongoose.model('destination',destinationSchema)