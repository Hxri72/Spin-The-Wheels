const express = require('express')
const storageImg = require('../multer/multer')
const desStorageImg = require('../multer/multerDestinations')
const NewsImg = require('../multer/multer-News')
const router = express.Router()
const AdminControllers = require('../controllers/AdminControllers')


router.get('/',AdminControllers.getAdminlogin)

router.get('/adminhome',AdminControllers.getAdminHome)

router.get('/adminuser',AdminControllers.getAllUsers)

router.get('/admincategory',AdminControllers.getAllCategory)

router.get('/adminBanner',AdminControllers.getUserBanner)

router.get('/addbanner',AdminControllers.getAddBanner)

router.get('/admindestinations',AdminControllers.getAdminDestinations)

router.get('/adminnews',AdminControllers.getAdminNews)

router.get('/addnews',AdminControllers.getAddNews)

router.get('/adminOrders',AdminControllers.getAdminOrders)

router.get('/addestination',AdminControllers.getaddDestinations)

router.get('/editDestination/:id',AdminControllers.getEditDestination)

router.get('/userblock/:id',AdminControllers.getUserBlock)

router.get('/userUnblock/:id',AdminControllers.getUserUnblock)

router.get('/adminlogout',AdminControllers.getAdminlogout)

router.get('/categoryproduct/:category',AdminControllers.getCategoryProduct)

router.get('/deletecategory/:category',AdminControllers.getdeleteCategory)

router.get('/editproduct/:id',AdminControllers.getEditProduct)

router.get('/editBanner/:id',AdminControllers.getEditbanner)

router.get('/viewOrders/:id',AdminControllers.getViewOrders)

router.get('/placeOrder/:id',AdminControllers.getplacedOrders)

router.get('/shippedOrder/:id',AdminControllers.getshippedOrders)

router.get('/cancelledOrder/:id',AdminControllers.getcancelledOrders)

router.get('/deliveredOrder/:id',AdminControllers.getdeliveredOrders)

router.get('/softdeletebanner/:id',AdminControllers.getSoftDeleteBanner)

router.get('/undosoftdeletebanner/:id',AdminControllers.getUndoSoftDeleteBanner)

router.get('/softdeleteproduct/:id',AdminControllers.getSoftDeleteProduct)

router.get('/undosoftdeleteproduct/:id',AdminControllers.getUndoSoftDeleteProduct)

router.get('/deleteproduct/:id',AdminControllers.getdeleteProduct)

router.get('/deletedestination/:id',AdminControllers.getdeleteDestination)

router.get('/deletenews/:id',AdminControllers.getdeleteNews)

router.get('/adminproduct',AdminControllers.getAdminProduct)

router.get('/addproduct',AdminControllers.getaddProduct)

router.get('/editNews/:id',AdminControllers.geteditNews)

router.post('/addbanner',storageImg.array("bannerImg",2),AdminControllers.postAddBanner)

router.post('/addnews',NewsImg.array("NewsImg",2),AdminControllers.postAddNews)

router.post('/addestination',desStorageImg.array("destinationImg",2),AdminControllers.postAddDestination)

router.post('/editdestination/:id',desStorageImg.array("destinationImg",2),AdminControllers.postEditDestination)

router.post('/editBanner/:id',storageImg.array("bannerImg",2),AdminControllers.postEditBanner)

router.post('/editproduct/:id',storageImg.array("productImg",2),AdminControllers.postEditProduct)

router.post('/editnews/:id',NewsImg.array("NewsImg",2),AdminControllers.postEditNews)

router.post('/addproduct',storageImg.array("productImg",2),AdminControllers.postAddProduct)

router.post('/addCategory',AdminControllers.postAddCategory)

router.post('/adminlogin',AdminControllers.PostAdminlogin)



module.exports = router