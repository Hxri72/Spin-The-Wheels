const mongoose = require('mongoose')
require("dotenv").config();


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true});


mongoose.connection
    .once('open',()=>console.log('Database connected')) 
    .on('error',(error)=>{
        console.log("Error",error);
    })