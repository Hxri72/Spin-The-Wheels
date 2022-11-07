const multer = require('multer')


const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./public/images')
    },
    filename:function(req,file,callback){
        const unique = Date.now()+'.jpg'
        callback(null,unique)
    }
})
const storageImg = multer({storage:storage})
module.exports = storageImg

const desStorage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./public/images/Destination-Images')
    },
    filename:function(req,file,callback){
        const unique = Date.now()+'.jpg'
        callback(null,unique)
    }
})
const desStorageImg = multer({storage:desStorage})
module.exports = desStorageImg