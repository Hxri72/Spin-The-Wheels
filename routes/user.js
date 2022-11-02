const express = require("express");
const UserControllers = require("../controllers/UserControllers");
const router = express.Router();

router.get("/", UserControllers.getUserHome);

router.get('/signup',UserControllers.getUserSignup)

router.get('/login',UserControllers.getUserlogin)

router.get('/otp',UserControllers.getOtp)

router.get('/aboutus',UserControllers.getAboutUs)

router.get('/shop',UserControllers.getUserShop)

router.get('/cart',UserControllers.getCart)

router.get('/checkout',UserControllers.getCheckOut)

router.get('/addtocart/:id',UserControllers.getUserCart)

router.get('/deleteproductcart/:id',UserControllers.getdeleteProductcart)

router.get('/logout',UserControllers.getUserlogout)

router.get('/profile',UserControllers.getUserProfile)

router.get('/productdetails/:id',UserControllers.getProductDetails)

router.get('/wishlist',UserControllers.getUserWishlist)

router.get('/wishlist/:id',UserControllers.getAddtoWishlist)

router.get('/deleteproduct/:id',UserControllers.getdeleteProduct)

router.post('/search',UserControllers.postProductSearch)

router.post('/cartinc/:id',UserControllers.postUserCartinc)

router.post('/updateprofile',UserControllers.postUpdateProfile)

router.post('/postotp',UserControllers.PostUserOtp)

router.post('/signup',UserControllers.PostUsersignup)

router.post('/login',UserControllers.PostUserlogin)


module.exports = router;
