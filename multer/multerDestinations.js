const multer = require('multer')

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