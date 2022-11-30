const express = require("express");
const UserControllers = require("../controllers/UserControllers");
const router = express.Router();

router.get("/", UserControllers.getUserHome);

router.get('/signup',UserControllers.getUserSignup)

router.get('/login',UserControllers.getUserlogin)

router.get('/otp',UserControllers.getOtp)

router.get('/resend',UserControllers.getResendOtp)

router.get('/contactus',UserControllers.getcontactUs)

router.get('/shop',UserControllers.getUserShop)

router.get('/destinations',UserControllers.getUserDestinations)

router.get('/news',UserControllers.getUserNews)

router.get('/cart',UserControllers.getCart)

router.get('/checkout/:id',UserControllers.getCheckOut)

router.get('/addtocart/:id',UserControllers.getUserCart)

router.get('/deleteproductcart/:id',UserControllers.getdeleteProductcart)

router.get('/logout',UserControllers.getUserlogout)

router.get('/profile',UserControllers.getUserProfile)

router.get('/productdetails/:id',UserControllers.getProductDetails)

router.get('/destinationDetails/:id',UserControllers.getdestinationDetails)

router.get('/newsdetails/:id',UserControllers.getnewsDetails)

router.get('/wishlist',UserControllers.getUserWishlist)

router.get('/wishlist/:id',UserControllers.getAddtoWishlist)

router.get('/deleteproduct/:id',UserControllers.getdeleteProduct)

router.get('/placedOrder',UserControllers.getPlacedOrder)

router.get('/MyOrders',UserControllers.getMyOrders)

router.get('/cancelorder/:id',UserControllers.getCancelOrder)

router.get('/categoryproduct/:id',UserControllers.getcategoryProduct)

router.get('/deleteaddress/:id',UserControllers.getdeleteAddress)

router.post('/addaddress',UserControllers.postaddAddress)

router.post('/applycoupon/:id',UserControllers.postapplyCoupon)

router.post('/cartinc/:id',UserControllers.postUserCartinc)

router.post('/totalBill/:id',UserControllers.postUserTotal)

router.post('/checkout/:id',UserControllers.PostUserCheckout)

router.post('/verifypayment',UserControllers.postverifyPayment)

router.post('/postotp',UserControllers.PostUserOtp)

router.post('/signup',UserControllers.PostUsersignup)

router.post('/login',UserControllers.PostUserlogin)

router.use(function (req, res, next) {
    next(createError(404));
  });
  
  router.use(function (err, req, res, next) {
    res.status(err.status || 404);
    res.render('user/error');
  });

module.exports = router;
