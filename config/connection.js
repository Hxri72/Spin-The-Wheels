const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://Hariprasad7217:Ad6LtKGLHBb8rRTs@cluster0.xcqajze.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true});


mongoose.connection
    .once('open',()=>console.log('Database connected')) 
    .on('error',(error)=>{
        console.log("Error",error);
    })