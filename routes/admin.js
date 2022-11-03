const express = require('express')
const storageImg = require('../multer/multer')
const router = express.Router()
const AdminControllers = require('../controllers/AdminControllers')


router.get('/',AdminControllers.getAdminlogin)

router.get('/adminhome',AdminControllers.getAdminHome)

router.get('/adminuser',AdminControllers.getAllUsers)

router.get('/admincategory',AdminControllers.getAllCategory)

router.get('/adminBanner',AdminControllers.getUserBanner)

router.get('/addbanner',AdminControllers.getAddBanner)

router.get('/admindestinations',AdminControllers.getAdminDestinations)

router.get('/userblock/:id',AdminControllers.getUserBlock)

router.get('/userUnblock/:id',AdminControllers.getUserUnblock)

router.get('/adminlogout',AdminControllers.getAdminlogout)

router.get('/categoryproduct/:category',AdminControllers.getCategoryProduct)

router.get('/deletecategory/:category',AdminControllers.getdeleteCategory)

router.get('/editproduct/:id',AdminControllers.getEditProduct)

router.get('/softdeleteproduct/:id',AdminControllers.getSoftDeleteProduct)

router.get('/undosoftdeleteproduct/:id',AdminControllers.getUndoSoftDeleteProduct)

router.get('/deleteproduct/:id',AdminControllers.getdeleteProduct)

router.get('/adminproduct',AdminControllers.getAdminProduct)

router.get('/addproduct',AdminControllers.getaddProduct)

router.post('/addbanner',storageImg.array("bannerImg",2),AdminControllers.postAddBanner)

router.post('/editproduct/:id',storageImg.array("productImg",2),AdminControllers.postEditProduct)

router.post('/addproduct',storageImg.array("productImg",2),AdminControllers.postAddProduct)

router.post('/addCategory',AdminControllers.postAddCategory)

router.post('/adminlogin',AdminControllers.PostAdminlogin)



module.exports = router