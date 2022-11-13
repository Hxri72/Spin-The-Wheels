const multer = require('multer')


const Newsstorage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./public/images/News-Images')
    },
    filename:function(req,file,callback){
        const unique = Date.now()+'.jpg'
        callback(null,unique)
    }
})
const NewsImg = multer({storage:Newsstorage})
module.exports = NewsImg
