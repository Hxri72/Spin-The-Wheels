const express = require("express");
const UserControllers = require("../controllers/UserControllers");
const router = express.Router();

router.get("/", UserControllers.getUserHome);

router.get('/signup',UserControllers.getUserSignup)

router.get('/login',UserControllers.getUserlogin)

router.get('/otp',UserControllers.getOtp)

router.get('/resend',UserControllers.getResendOtp)

router.get('/aboutus',UserControllers.getAboutUs)

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

router.get('/wishlist',UserControllers.getUserWishlist)

router.get('/wishlist/:id',UserControllers.getAddtoWishlist)

router.get('/deleteproduct/:id',UserControllers.getdeleteProduct)

router.get('/placedOrder',UserControllers.getPlacedOrder)

router.get('/MyOrders',UserControllers.getMyOrders)

router.post('/search',UserControllers.postProductSearch)

router.post('/cartinc/:id',UserControllers.postUserCartinc)

router.post('/totalBill/:id',UserControllers.postUserTotal)

router.post('/updateprofile',UserControllers.postUpdateProfile)

router.post('/updateDetails',UserControllers.postUpdateDetails)

router.post('/payment/:id',UserControllers.PostUserCheckout)

router.post('/postotp',UserControllers.PostUserOtp)

router.post('/signup',UserControllers.PostUsersignup)

router.post('/login',UserControllers.PostUserlogin)


module.exports = router;
