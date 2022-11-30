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


let Err = null;
let loginErr;
let addressErr;
let viewcart;
module.exports = {
    getUserlogin : (req,res,next)=>{
        try {
            let user = req.session.user
            res.render('user/login',{user,loginErr})
            loginErr = null 
        } catch (error) {
            next(error)
        }
        
    },
    getUserHome :async (req,res,next)=>{
        try {
            if(req.session.loggedIn){
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
    getUserSignup:(req,res,next)=>{
        try {
            Err = req.session.Err
            res.render('user/signup',{Err})
            Err = null; 
        } catch (error) {
            next(error)
        }
        
    },
    getUserProfile:async(req,res,next)=>{
        try {
            if(req.session.loggedIn){
                let user = req.session.user
                let viewAddress = await userModel.find({_id:user._id}).populate('Address._id').exec()
                console.log(viewAddress)
                res.render('user/profile',{user,addressErr,viewAddress})
                addressErr = null
            }else{
                res.redirect('/login')
            }
        } catch (error) {
           next(error) 
        }
        
        
    },
    getcontactUs:(req,res,next)=>{
        try {
            if(req.session.loggedIn){
                let user = req.session.user
                res.render('user/contact-us',{user})
            }else{
                res.render('user/contact-us',{user:false})
            }
            
        } catch (error) {
            next(error)
        }
    },
    getAddtoWishlist:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
        }
        
    },
    getUserWishlist : async(req,res,next) =>{
        try {
            if(loggedIn){
                let userId = req.session.user._id
                let viewWishlist = await wishlistModel.findOne({UserId:userId}).populate('products.productId').exec()
                console.log(viewWishlist)
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
        } catch (error) {
            next(error)
        }
       
        
    },
    getdeleteProduct:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
        }
        
    },
    getdeleteProductcart:async(req,res,next)=>{
        try {
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
        res.json({status:true})
        } catch (error) {
            next(error)
        }
        
    },
    getUserShop:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
        }
        
         
    },
    getUserDestinations:(req,res,next)=>{
        try {
            destinationModel.find({},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/destinations',{user,result})
                }
            })  
        } catch (error) {
            next(error)
        }
        
    },
    getUserNews:(req,res,next)=>{
        try {
            newsModel.find({},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/news',{user,result})
                }
            })   
        } catch (error) {
            next(error)
        }
        
        
    },
    getProductDetails:(req,res,next)=>{ 
        try {
            productModel.find({_id:req.params.id},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/product-details',{user,result})
                }
            })  
        } catch (error) {
            next(error)
        }
            
    },
    getdestinationDetails: (req,res,next)=>{
        try {
            destinationModel.find({_id:req.params.id},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/destinationDetails',{user,result})
                }
            })   
        } catch (error) {
            next(error)
        }
        
    },
    getnewsDetails : (req,res,next) => {
        try {
            newsModel.find({_id:req.params.id},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/newsDetails',{user,result})
                }
            })  
        } catch (error) {
            next(error)
        }
        
    },
    getUserCart:async(req,res,next)=>{
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
    getCart:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
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
    getUserlogout:(req,res,next)=>{
        try {
            req.session.destroy()
            res.redirect('/') 
        } catch (error) {
            next(error)
        }
        
    },
    getOtp:(req,res,next)=>{
        try {
            res.render('user/otp') 
        } catch (error) {
           next(error) 
        }
        
    },
    getResendOtp:(req,res,next)=>{
        try {
            req.session.otpgenerator = otpverification.otpgenerator();
        console.log(req.session.otpgenerator)

        // message sending
        // otpverification.otpsender(req.session.otpgenerator)
        // .then(()=>{
        //     res.redirect('/otp')
        // })
        res.redirect('/otp')
        } catch (error) {
            next(error)
        }
        
    },
    getPlacedOrder:(req,res,next)=>{
        try {
            let user = req.session.user
            res.render('user/placedOrder',{user}) 
        } catch (error) {
           next(error) 
        }
        
    },
    getMyOrders:async(req,res,next) => {
        try {
            if(loggedIn){
                let userId = req.session.user._id
                let vieworders = await orderModel.find({UserId:userId}).populate('Products.productId').exec()
                let viewOrders = vieworders.reverse()
                let user = req.session.user
                res.render('user/myorders',{user,viewOrders})
                
                
            }else{
                res.redirect('/login')
            }  
        } catch (error) {
            next(error)
        }
        
    },
    getCancelOrder:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
        }
        
    },
    getcategoryProduct:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
        }
        
    },
    getdeleteAddress:(req,res,next)=>{
        try {
            if(loggedIn){
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
            }else{
                res.redirect('/login')
            }
        } catch (error) {
            next(error)
        }
        
        
    },
    postaddAddress :async (req,res,next) => {
        try {
            if(loggedIn){
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
            }else{
                res.redirect('/login')
            }   
        } catch (error) {
            next(error)
        }
        
        
    },
    postapplyCoupon:(req,res,next)=>{
        try {
            if(loggedIn){
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
            }else{
                res.redirect('/login')
            }
        } catch (error) {
            next(error)
        }
    },
    postUserCartinc:async(req,res,next)=>{
        try {
            if(loggedIn){
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
            }else{
                res.redirect('/login')
            }
        } catch (error) {
           next(error) 
        }
    },
    postUserTotal:async(req,res,next)=>{
        try {
            if(loggedIn){
                let totalPrice = req.params.id
            let userId = req.session.user._id
            let UserId = await userModel.findOne({UserId:userId})
    
            
            res.json({status:true})
            // res.render('user/checkout',{user})
            }else{
                res.redirect('/login')
            }
        } catch (error) {
            next(error)
        }
        
        

    },
    PostUserCheckout:async(req,res,next)=>{
        try {
            if(loggedIn){
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
            }else{
                res.redirect('/login')
            }
        } catch (error) {
            next(error)
        } 

    },
    postverifyPayment:async(req,res,next)=>{
        try {
            if(loggedIn){
                let userData = req.session.user
            userId = userData._id
           let details = req.body
           
           let hmac = crypto.createHmac('sha256','asHbACGyR2opOxqcRomRwPVE')
           hmac.update(details.payment.razorpay_order_id+'|'+ details.payment.razorpay_payment_id);
           hmac = hmac.digest('hex')
           if(hmac==details.payment.razorpay_signature){
            orderId = req.session.orderId
            await orderModel.findByIdAndUpdate(orderId,{paymentStatus:"Pending"})
            await cartModel.findOneAndDelete({ UserId: userId })
            res.json({status:true})
           }else{    
            res.json({status:'false'})
           }
           }else{
            res.redirect('/login')
           } 
        } catch (error) {
            next(error)
        }
        
        

    },
    PostUserOtp:(req,res,next)=>{
        try {
            const joinedbody=req.body.num1.join("")
            otpverification.otpverify(req.body.Phone,joinedbody) 
            .then(({status})=>{
                const user = userModel.create(req.session.otp)
                req.session.user = req.session.otp
                req.session.otp = null,
                req.session.otpgenerator = null,
                req.session.loggedIn = true
                res.redirect('/')
            })  
        } catch (error) {
            next(error)
        }
        
            
        
    },
    PostUsersignup:(req,res,next)=>{ 
        try {
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
                        // req.session.otpgenerator = otpverification.otpgenerator();
                        // console.log(req.session.otpgenerator)
                        // message sending
                        otpverification.otpsender(req.body.Phone)
                        .then(()=>{
                            res.redirect('/otp')
                        })
    
    
                        // res.redirect('/otp')
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
        } catch (error) {
            next(error)
        }
        
    },
    PostUserlogin:async(req,res,next)=>{
        try {
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
        } catch (error) {
            next(error)
        }
        
    
            
        
        
    },
    
}