const userModel = require('../models/user')
const userStatus = require('../models/user')
const bcrypt = require('bcrypt')
const {USER_COLLECTION}= require('../config/collection')
const otpverification = require('../utils/otpgenerator')
const productModel = require('../models/product')
const cartModel = require('../models/cart')
const wishlistModel = require('../models/wishlist')
const bannerModel = require('../models/banner')
const orderModel = require('../models/order')
const destinationModel = require('../models/destination')
const categoryModel = require('../models/category')
const newsModel = require('../models/news')
const couponModel = require('../models/coupon')
const Razorpay = require('razorpay');
const crypto = require('crypto')

let loggedIn = false;
let Err = null;
let loginErr;
let addressErr;
let viewcart;
module.exports = {
    getUserlogin : (req,res)=>{
        let user = req.session.user
        res.render('user/login',{user,loginErr})
        loginErr = null
    },
    getUserHome :async (req,res)=>{
        try {
            if(loggedIn){
                let news = await newsModel.find({})
                let destination = await destinationModel.find({})
                let banner = await bannerModel.find({})
                productModel.find({},(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        let user = req.session.user
                        res.render('user/index',{user,result,banner,destination,news})
                    }
                })
            }else{
                let news = await newsModel.find({})
                let destination = await destinationModel.find({})
                let banner = await bannerModel.find({})
                productModel.find({},(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.render('user/index',{user:false,result,banner,destination,news})
                    }
                })
                
            } 
        } catch (error) {
            next(error)
        }
        
        
    },
    getUserSignup:(req,res)=>{
        Err = req.session.Err
        res.render('user/signup',{Err})
        Err = null;
    },
    getUserProfile:async(req,res)=>{
        if(loggedIn){
            let user = req.session.user
            let viewAddress = await userModel.find({_id:user._id}).populate('Address._id').exec()
            console.log(viewAddress)
            res.render('user/profile',{user,addressErr,viewAddress})
            addressErr = null
        }else{
            res.redirect('/login')
        }
        
    },
    getAboutUs:(req,res)=>{
        if(loggedIn){
            let user = req.session.user
            res.render('user/about-us',{user})
        }else{
            res.render('user/about-us',{user:false})
        }
        
    },
    getAddtoWishlist:async(req,res)=>{
        let productId = req.params.id
        let userId = req.session.user._id
        let products = await productModel.find({_id:productId})
        let productExist = await wishlistModel.aggregate([
            { $match: { UserId: userId } },
            { $unwind: '$products' },
            { $match: { 'products.productId': productId } },
          ]);
        wishlistModel.findOne({UserId:userId},async(err,data)=>{
            if(data!==null){ 
                if(productExist.length===0){
                    await wishlistModel.updateOne({UserId:userId},{
                        $push : {
                            products :{
                                productId : productId ,
                                productname : products[0].productname,
                                price : products[0].price,
                                productImg : products[0].productImg
                            }
                        }
                    })
                    
                }
            }else{
                const wishlist = new wishlistModel ({
                    UserId : userId,
                    products : {
                        productId : productId ,
                        productname : products[0].productname,
                        price : products[0].price,
                        productImg : products[0].productImg,
                        quantity : 1 
                    }
                })
                wishlist.save()
            }
        })
    },
    getUserWishlist : async(req,res) =>{
        if(loggedIn){
            let userId = req.session.user._id
        let viewWishlist = await wishlistModel.findOne({UserId:userId}).populate('products.productId').exec()
        wishlistModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/wishlist',{user,result,viewWishlist})
            }
        })
        }else{
            res.redirect('/login')
        }
        
    },
    getdeleteProduct:async(req,res)=>{
        let userId = req.session.user
        let productId = req.params.id
        let productExist = await wishlistModel.aggregate([
            { $match: { UserId: userId } },
            { $unwind: '$products' },
            { $match: { 'products.productId': productId } },
          ]);
        wishlistModel.findOne({UserId:userId},async(err,data)=>{
            if(data){
                if(productExist.length===0){
                    await wishlistModel.updateOne({UserId:userId},{
                        $pull : {
                            products : {
                                productId : productId
                            }
                        }
                    }) 
                }
            }        
        })
        res.redirect('/wishlist')
    },
    getdeleteProductcart:async(req,res)=>{
        let userId = req.session.user._id
        let productId = req.params.id
        let productExist = await cartModel.aggregate([
            { $match: { UserId: userId } },
            { $unwind: '$products' },
            { $match: { 'products.productId': productId } },
          ]);
        cartModel.findOne({UserId:userId},async(err,data)=>{
            if(data){
                if(productExist.length!==0){
                    await cartModel.updateOne({UserId:userId},{
                        $pull : {
                            products : {
                                productId : productId
                            }
                        }
                    }) 
                }
            }        
        })
        res.redirect('/cart')
    },
    getUserShop:async(req,res)=>{
        let pageNum = req.query.page
        if(pageNum===undefined){
            pageNum = 1;
        }
        const perPage = 9
        let docCount;

        let category = await  categoryModel.find({})
        let result = await productModel.find()
        .countDocuments()
        .then(documents =>{
            docCount = documents;
            return productModel.find().skip((pageNum-1) * perPage).limit(perPage)
        })
        
        .then(result =>{
            let user = req.session.user 
            res.render('user/shop',{user,result,category,currentPage:pageNum,totalDocuments:docCount,pages:Math.ceil(docCount/perPage)}) 
        })
         
    },
    getUserDestinations:(req,res)=>{
        destinationModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/destinations',{user,result})
            }
        })
    },
    getUserNews:(req,res)=>{
        newsModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/news',{user,result})
            }
        })
        
    },
    getProductDetails:(req,res)=>{ 
            productModel.find({_id:req.params.id},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/product-details',{user,result})
                }
            })
    },
    getdestinationDetails: (req,res)=>{
        destinationModel.find({_id:req.params.id},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/destinationDetails',{user,result})
            }
        })
    },
    getnewsDetails : (req,res) => {
        newsModel.find({_id:req.params.id},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/newsDetails',{user,result})
            }
        })
    },
    getUserCart:async(req,res)=>{
        try {
            if(loggedIn){
                let productId = req.params.id
                let userId = req.session.user._id
                let products = await productModel.find({_id:productId})
                let productExist = await cartModel.aggregate([
                { $match: { UserId: userId } },
                { $unwind: '$products' },
                { $match: { 'products.productId': productId } },
                ]);
                cartModel.findOne({UserId:userId},async(err,data)=>{
                if(data){
                        if(productExist.length!==0){
                            await cartModel.updateOne({UserId:userId,'products.productId':productId},{
                                $inc : {
                                    'products.$.quantity' : 1
                                }
                            })
                            
                        }else{
                            await cartModel.updateOne({UserId:userId},{
                                $push:{
                                    products : {
                                        productId : productId ,
                                        productname : products[0].productname,
                                        price : products[0].price,
                                        productImg : products[0].productImg,
                                        quantity : 1 
                                    }
                                }
                            })
                        }
                   
                }else{
                    const cart = new cartModel ({
                        UserId : userId,
                        products : {
                            productId : productId ,
                            productname : products[0].productname,
                            price : products[0].price,
                            productImg : products[0].productImg,
                            quantity : 1 
                        }
                    })
                    cart.save()
                }
                })
            }else{
                res.redirect('/login')
            }
        } catch (error) {
            next(error)
        }
        
        
    },
    getCart:async(req,res)=>{
        if(loggedIn){
            let userId = req.session.user._id
            let viewcart = await cartModel.findOne({UserId:userId}).populate('products.productId').exec()
            if(viewcart===null){
                cartModel.find({},(err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        let user = req.session.user
                        res.render('user/cart',{user,result,viewcart})
                    }
                })
            }else{
                if(viewcart.products.length===0){
                    cartModel.find({},(err,result)=>{
                        if(err){
                            console.log(err)
                        }else{
                            let user = req.session.user
                            res.render('user/cart',{user,result,viewcart})
                        }
                    })
                }else{
                    if(viewcart.products.length!==0){
                        cartModel.find({},(err,result)=>{
                            if(err){
                                console.log(err)
                            }else{
                                let user = req.session.user
                                res.render('user/cart',{user,result,viewcart})
                            }
                        })
                    }
                    
                }

            }
        
        }else{
            res.redirect('/login')
        }
        
        
    },
    getCheckOut :async(req,res,next) =>{
        try {
            if(loggedIn){
                let coupon = await couponModel.find({})
                let total = req.params.id
                let userId = req.session.user._id
                let viewcart = await cartModel.findOne({UserId:userId}).populate('products.productId').exec()
                let userAddress = await userModel.findOne({_id:userId}).populate('Address._id').exec()
                let user = req.session.user       
                res.render('user/checkout',{user,total,viewcart,coupon,userAddress})               
                }else{
                    res.redirect('/login')
                }
        } catch (error) {
            next(error)
        }
        
        
    },
    getUserlogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    },
    getOtp:(req,res)=>{
        res.render('user/otp')
    },
    getResendOtp:(req,res)=>{
        req.session.otpgenerator = otpverification.otpgenerator();
        console.log(req.session.otpgenerator)

        // message sending
        // otpverification.otpsender(req.session.otpgenerator)
        // .then(()=>{
        //     res.redirect('/otp')
        // })
        res.redirect('/otp')
    },
    getPlacedOrder:(req,res)=>{
        let user = req.session.user
        res.render('user/placedOrder',{user})
    },
    getMyOrders:async(req,res) => {
        if(loggedIn){
            let userId = req.session.user._id
            let vieworders = await orderModel.find({UserId:userId}).populate('Products.productId').exec()
            let viewOrders = vieworders.reverse()
            let user = req.session.user
            res.render('user/myorders',{user,viewOrders})
            
            
        }else{
            res.redirect('/login')
        }
    },
    getCancelOrder:async(req,res)=>{
        if(loggedIn){
            let orderId = req.params.id
            await orderModel.updateOne({_id:orderId},{
            $set:{
                paymentStatus : "Cancelled"
            }
        })
        res.json({status:true})

        }else{
            res.redirect('/login')
        }
    },
    getcategoryProduct:async(req,res)=>{
        let category = await categoryModel.find({})
        let categoryName = req.params.category
        productModel.find({category:categoryName},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/shop',{user,result,category})
            }
        })
    },
    getuserError:(req,res) => {
        res.render('user/error')
    },
    getdeleteAddress:(req,res)=>{
        console.log(req.params.id)
        let userId = req.session.user._id
        let addressId = req.params.id
        userModel.findOne({_id:userId},async(err,data)=>{
            if(data){
                
                    await userModel.updateOne({_id:userId},{
                        $pull : {
                            Address : {
                                _id : addressId
                            }
                        }
                    }) 
                
            }     
            res.json({status:true})   
        })

        
    },
    postaddAddress :async (req,res) => {
        let userId = req.session.user._id
        userModel.find({_id:userId},async(err,data)=>{
            if(data){
                    console.log('its Working')
                    console.log(req.body)
                    await userModel.updateOne({_id:userId},{
                        $push:{
                            Address:{
                                Address:req.body.address,
                                District:req.body.district,
                                Phone:req.body.phone,
                                State:req.body.state,
                                Postcode:req.body.postcode
                            }
                        }
                    })
                 
            }
        })
        res.redirect('/profile')
    },
    postapplyCoupon:(req,res)=>{
        str = req.params.id
        let array = str.split("!");
        let couponCode = array[0]
        let orderTotal= array[1]

        let userId = req.session.user._id
        couponModel.find({CouponCode:couponCode},(err,data)=>{
            if(data.length!==0){
                userModel.findOne({_id:userId},async(err,user)=>{                  
                    if(user){
                       let itemIndex = user.coupons.findIndex(p =>  p.couponId == data[0]._id)
                       if(itemIndex===-1){
                        let date = new Date().toJSON().slice(0,10)
                        if(date <= data[0].ExpiryDate){
                            let discount = (orderTotal*data[0].Percentage)/100
                            console.log(discount)
                            if(Number(discount) <= Number(data[0].Maxamount)){
                                if(data[0].Minamount <= orderTotal){
                                    await userModel.updateOne({_id:userId},{
                                        $push:{
                                            coupons : {
                                                couponId : data[0]._id ,
                                                couponName : data[0].CouponName ,
                                                couponCode : data[0].CouponCode ,
                                                description : data[0].Description ,
                                                percentage : data[0].Percentage ,
                                                minAmount : data[0].Minamount ,
                                                maxAmount : data[0].Maxamount ,
                                                expiryDate : data[0].ExpiryDate
                                            }
                                        }
                                    })
                                    let couponObj = {
                                        discount : data[0].Percentage,
                                        couponId : data[0]._id
                                    }
                                    req.session.coupon = couponObj
                                    res.json({couponObj})
                                }else{
                                    req.session.couponErr = "This coupon is not Applicable to this amount!"
                                    let couponErr = req.session.couponErr
                                    res.json({couponErr})
                                }
                            }else{
                                await userModel.updateOne({_id:userId},{
                                    $push:{
                                        coupons : {
                                            couponId : data[0]._id ,
                                            couponName : data[0].CouponName ,
                                            couponCode : data[0].CouponCode ,
                                            description : data[0].Description ,
                                            percentage : data[0].Percentage ,
                                            minAmount : data[0].Minamount ,
                                            maxAmount : data[0].Maxamount ,
                                            expiryDate : data[0].ExpiryDate
                                        }
                                    }
                                })
                                let couponLimit = {
                                    maxAmount : data[0].Maxamount,
                                    discount : data[0].Percentage,
                                    couponId : data[0]._id
                                }
                                req.session.coupon = couponLimit
                                res.json({couponLimit})
                            }
                        }else{
                            req.session.couponErr = "This Coupon is Expired!"
                            let couponErr = req.session.couponErr
                            res.json({couponErr})
                        }
                       }else{
                        req.session.couponErr = "This Coupon is already used!"
                        let couponErr = req.session.couponErr
                        res.json({couponErr})
                       }
                    }
                })
            }
        })
        

    },
    postProductSearch:async(req,res)=>{
        console.log(req.body)
        let product = await productModel.find({productname:req.body.search})
        console.log(product)
    },
    postUserCartinc:async(req,res)=>{
        str = req.params.id
        let array = str.split("t");
        userId = req.session.user._id
        productId = array[0]
        Quantity = array[1]
        let productExist = await cartModel.aggregate([
            { $match: { UserId: userId } },
            { $unwind: '$products' },
            { $match: { 'products.productId': productId } }, 
          ]);
          
          cartModel.findOne({UserId:userId},async(err,data)=>{
            if(data){
                if(productExist!==0){
                    await cartModel.updateOne({UserId:userId,'products.productId':productId},{"products.$.quantity" : Quantity})
                }
            }
        })
        res.json({status:true})
    },
    postUserTotal:async(req,res)=>{
        let totalPrice = req.params.id
        let userId = req.session.user._id
        let UserId = await userModel.findOne({UserId:userId})

        
        res.json({status:true})
        // res.render('user/checkout',{user})

    },
    postUpdateProfile:async(req,res)=>{
            userModel.findOne({Email:req.body.email},async(err,data)=>{
                if(data){
                        await userModel.updateOne({Email:req.body.email},{
                            $set : {
                                Address : req.body.address 
                                }
                            })
                        }
                    })
                    let user = await userModel.findOne({Email:req.body.email})
                    console.log(user)
                    console.log('hi')
                    console.log(req.session.user)
                    res.redirect('/profile')
                
          
    },
    postUpdateDetails:async(req,res)=>{
        console.log(req.body) 
        let user = req.session.user._id
        console.log(user)
    },
    PostUserCheckout:async(req,res)=>{
        let discount;
        let total =  req.params.id
        let coupon = req.session.coupon
        console.log(coupon)
        if(coupon!== undefined){
            discount = (total*coupon.discount)/100

        }else{
            discount = 0;
        } 
        
        let finalTotal = total - discount
        let userId = req.session.user._id
        let cart =  await cartModel.findOne({UserId:userId}).populate('products.productId').exec()
        let cartProducts = cart.products
        let productArray = []
        for(let i=0 ; i < cartProducts.length; i++){
            let orderProducts = {}
            orderProducts.productId = cartProducts[i].productId
            orderProducts.productname = cartProducts[i].productname
            orderProducts.price = cartProducts[i].price
            orderProducts.quantity = cartProducts[i].quantity
            orderProducts.productImg = cartProducts[i].productImg
            productArray.push(orderProducts)
        }



        if(req.body.payment==='COD'){
            orderModel.findOne({UserId:userId},async(err,data)=>{
                if(data===null){
                    const order = new orderModel ({
                        UserId : userId,
                        paymentMode : req.body.payment,
                        totalPrice : finalTotal,
                        paymentStatus : "Pending",
                        Date : new Date().toJSON().slice(0,10),
                        Products : productArray, 
                        Address : {
                            Fullname : req.body.fullname,
                            Address : req.body.address,
                            District : req.body.district,
                            Phone : req.body.phone,
                            State : req.body.state,
                            Post : req.body.post
                        }
                        
                    })
                    order.save()
                    await cartModel.deleteOne({UserId:userId})
                }else{
                    const order = new orderModel ({
                        UserId : userId,
                        paymentMode : req.body.payment,
                        totalPrice : finalTotal,
                        paymentStatus : "Pending",
                        Date : new Date().toJSON().slice(0,10),
                        Products : productArray,
                        Address : {
                            Fullname : req.body.fullname,
                            Address : req.body.address,
                            District : req.body.district,
                            Phone : req.body.phone,
                            State : req.body.state,
                            Post : req.body.post
                        }
                        
                    })
                    order.save()
                    await cartModel.deleteOne({UserId:userId})
                }
            })
            
            let user = req.session.user
            res.json({codSuccess:true})
        }else{
            const order = new orderModel ({
                UserId : userId,
                paymentMode : req.body.payment,
                totalPrice : finalTotal,
                paymentStatus : "Pending",
                Date : new Date().toJSON().slice(0,10),
                Products : productArray,
                Address : {
                    Fullname : req.body.fullname,
                    Address : req.body.address,
                    District : req.body.district,
                    Phone : req.body.phone,
                    State : req.body.state,
                    Post : req.body.post
                }
                
            })
            order.save()
            
            req.session.orderId = order._id

            var instance = new Razorpay({
                key_id: 'rzp_test_AQfrPxez6XIGSl',
                key_secret: 'asHbACGyR2opOxqcRomRwPVE',
            });

            var options = {
                amount: finalTotal*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+req.session.orderId
              };
              instance.orders.create(options, function(err, order) {
                res.json(order)
                });
        }

    },
    postverifyPayment:async(req,res)=>{

        let userData = req.session.user
        userId = userData._id
       console.log(req.body);
       let details = req.body
       
       let hmac = crypto.createHmac('sha256','asHbACGyR2opOxqcRomRwPVE')
       hmac.update(details.payment.razorpay_order_id+'|'+ details.payment.razorpay_payment_id);
       hmac = hmac.digest('hex')
       if(hmac==details.payment.razorpay_signature){
        orderId = req.session.orderId
        console.log(orderId);
        await orderModel.findByIdAndUpdate(orderId,{paymentStatus:"Pending"})
        await cartModel.findOneAndDelete({ UserId: userId })
        console.log('payment success')
        res.json({status:true})
       }else{    
        console.log("payment failed");
        res.json({status:'false'})
       }

    },
    PostUserOtp:(req,res)=>{
        const joinedbody=req.body.num1.join("")
        if(req.session.otpgenerator===joinedbody){
            const user = userModel.create(req.session.otp)
            req.session.user = req.session.otp
            req.session.otp = null,
            req.session.otpgenerator = null,
            loggedIn = true
            res.redirect('/')
        }
    },
    PostUsersignup:(req,res)=>{ 
        userModel.find({Email:req.body.Email},async(err,data)=>{
            if(data.length==0){
                // Confirm password validation
                if(req.body.Password===req.body.ConfirmPassword)
                {
                    //inserting the data into database
                    const user = new userModel ({
                        Fullname:req.body.Fullname,
                        Email:req.body.Email,
                        Phone:req.body.Phone,
                        Password: await bcrypt.hash(req.body.Password,10),
                        userStatus:"active"
    
                    })

                    req.session.otp = user
                    req.session.otpgenerator = otpverification.otpgenerator();
                    console.log(req.session.otpgenerator)
                    // message sending
                    // otpverification.otpsender(req.session.otpgenerator)
                    // .then(()=>{
                    //     res.redirect('/otp')
                    // })


                    res.redirect('/otp')
                }else{
                    console.log('err');
                    req.session.Err = "The password is not matched"
                    res.redirect('/signup')
                }
                
            }else{
                Err = "Invalid Email"
                res.redirect('/signup')
            }
        })
    },
    PostUserlogin:async(req,res)=>{
        let user =await userModel.findOne({Email:req.body.Email})
        if(user){
            if(user.userStatus === "active"){
                bcrypt.compare(req.body.Password,user.Password).then((data)=>{
                    if(data){
                        loggedIn = true
                        req.session.user = user
                        res.redirect('/')
                    }else{
                        loginErr = "Invalid Password"
                        res.redirect('/login')
                    }
                })
            }else{
                loginErr = "You are Blocked by Admin"
                res.redirect('/login')
            }
        }else{
            loginErr = "Invalid Email"
            res.redirect('/login')
        }
    
            
        
        
    },
    
}