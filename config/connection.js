const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/SpinTheWheels',{useNewUrlParser:true});


mongoose.connection
    .once('open',()=>console.log('Database connected'))
    .on('error',(error)=>{
        console.log("Error",error);
    })