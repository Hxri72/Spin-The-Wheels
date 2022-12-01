const express = require('express')
const storageImg = require('../multer/multer')
const desStorageImg = require('../multer/multerDestinations')
const NewsImg = require('../multer/multer-News')
const router = express.Router()
const AdminControllers = require('../controllers/AdminControllers')

//for adminSession
const verifyAdmin = ((req, res, next) => {
    if (req.session.adminloggedIn) {
      next()
    } else {
      res.redirect('/admin')
    }
  })

router.get('/',AdminControllers.getAdminlogin)

router.get('/adminhome',verifyAdmin,AdminControllers.getAdminHome)

router.get('/getdashboarddetails',AdminControllers.getdashboardDetails)

router.get('/dashboardBar',AdminControllers.getdashboardBar)

router.get('/adminuser',verifyAdmin,AdminControllers.getAllUsers)

router.get('/admincategory',verifyAdmin,AdminControllers.getAllCategory)

router.get('/adminBanner',verifyAdmin,AdminControllers.getUserBanner)

router.get('/addbanner',verifyAdmin,AdminControllers.getAddBanner)

router.get('/admindestinations',verifyAdmin,AdminControllers.getAdminDestinations)

router.get('/adminnews',verifyAdmin,AdminControllers.getAdminNews)

router.get('/admincoupon',verifyAdmin,AdminControllers.getadminCoupon)

router.get('/adminsales',verifyAdmin,AdminControllers.getadminSales)

router.get('/addcoupon',verifyAdmin,AdminControllers.getaddCoupon)

router.get('/editcoupon/:id',verifyAdmin,AdminControllers.geteditCoupon)

router.get('/addnews',verifyAdmin,AdminControllers.getAddNews)

router.get('/adminOrders',verifyAdmin,AdminControllers.getAdminOrders)

router.get('/addestination',verifyAdmin,AdminControllers.getaddDestinations)

router.get('/editDestination/:id',verifyAdmin,AdminControllers.getEditDestination)

router.get('/userblock/:id',verifyAdmin,AdminControllers.getUserBlock)

router.get('/userUnblock/:id',verifyAdmin,AdminControllers.getUserUnblock)

router.get('/categoryproduct/:category',verifyAdmin,AdminControllers.getCategoryProduct)

router.get('/deletecategory/:category',verifyAdmin,AdminControllers.getdeleteCategory)

router.get('/editproduct/:id',verifyAdmin,AdminControllers.getEditProduct)

router.get('/editBanner/:id',verifyAdmin,AdminControllers.getEditbanner)

router.get('/viewOrders/:id',verifyAdmin,AdminControllers.getViewOrders)

router.get('/placeOrder/:id',verifyAdmin,AdminControllers.getplacedOrders)

router.get('/shippedOrder/:id',verifyAdmin,AdminControllers.getshippedOrders)

router.get('/cancelledOrder/:id',verifyAdmin,AdminControllers.getcancelledOrders)

router.get('/deliveredOrder/:id',verifyAdmin,AdminControllers.getdeliveredOrders)

router.get('/softdeletebanner/:id',verifyAdmin,AdminControllers.getSoftDeleteBanner)

router.get('/undosoftdeletebanner/:id',verifyAdmin,AdminControllers.getUndoSoftDeleteBanner)

router.get('/softdeleteproduct/:id',verifyAdmin,AdminControllers.getSoftDeleteProduct)

router.get('/undosoftdeleteproduct/:id',verifyAdmin,AdminControllers.getUndoSoftDeleteProduct)

router.get('/deleteproduct/:id',verifyAdmin,AdminControllers.getdeleteProduct)

router.get('/deletedestination/:id',verifyAdmin,AdminControllers.getdeleteDestination)

router.get('/deletenews/:id',verifyAdmin,AdminControllers.getdeleteNews)

router.get('/deletecoupon/:id',verifyAdmin,AdminControllers.getdeleteCoupon)

router.get('/adminproduct',verifyAdmin,AdminControllers.getAdminProduct)

router.get('/addproduct',verifyAdmin,AdminControllers.getaddProduct)

router.get('/editNews/:id',verifyAdmin,AdminControllers.geteditNews)

router.post('/addbanner',storageImg.array("bannerImg",2),verifyAdmin,AdminControllers.postAddBanner)

router.post('/addnews',NewsImg.array("NewsImg",2),verifyAdmin,AdminControllers.postAddNews)

router.post('/addestination',desStorageImg.array("destinationImg",2),verifyAdmin,AdminControllers.postAddDestination)

router.post('/editdestination/:id',desStorageImg.array("destinationImg",2),verifyAdmin,AdminControllers.postEditDestination)

router.post('/editBanner/:id',storageImg.array("bannerImg",2),verifyAdmin,AdminControllers.postEditBanner)

router.post('/editproduct/:id',storageImg.array("productImg",2),verifyAdmin,AdminControllers.postEditProduct)

router.post('/editnews/:id',NewsImg.array("NewsImg",2),verifyAdmin,AdminControllers.postEditNews)

router.post('/editcoupon/:id',verifyAdmin,AdminControllers.postEditCoupon)

router.post('/addproduct',storageImg.array("productImg",2),verifyAdmin,AdminControllers.postAddProduct)

router.post('/addCategory',verifyAdmin,AdminControllers.postAddCategory)

router.post('/addcoupon',verifyAdmin,AdminControllers.postaddCoupon)

router.post('/adminlogin',AdminControllers.PostAdminlogin)


router.get('/adminlogout',(req,res)=>{
    req.session.destroy();
     res.redirect('/admin')
 })

 router.use(function (req, res, next) {
  next(createError(404));
});

router.use(function (err, req, res, next) {
  res.status(err.status || 404);
  res.render('admin/Admin-Error');
});

module.exports = router