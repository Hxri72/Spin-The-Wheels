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
        if(loggedIn){
            let banner = await bannerModel.find({})
            productModel.find({},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/index',{user,result,banner})
                }
            })
        }else{
            let banner = await bannerModel.find({})
            productModel.find({},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    res.render('user/index',{user:false,result,banner})
                }
            })
            
        }
        
    },
    getUserSignup:(req,res)=>{

        res.render('user/signup',{Err})
    },
    getUserProfile:(req,res)=>{
        if(loggedIn){
            let user = req.session.user
            res.render('user/profile',{user,addressErr})
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
    getUserShop:(req,res)=>{
        productModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                let user = req.session.user
                res.render('user/shop',{user,result})
            }
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
        let user = req.session.user
        res.render('user/news',{user})
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
    getUserCart:async(req,res)=>{
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
    getCheckOut :async(req,res) =>{
        if(loggedIn){
        let total = req.params.id
        let userId = req.session.user._id
        let viewcart = await cartModel.findOne({UserId:userId}).populate('products.productId').exec()
        let user = req.session.user
        
        res.render('user/checkout',{user,total,viewcart})
        
        
        }else{
            res.redirect('/login')
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
            let viewOrders = await orderModel.find({UserId:userId}).populate('Products.productId').exec()
            console.log(viewOrders.length)
            console.log(viewOrders)
            let user = req.session.user
            res.render('user/myorders',{user,viewOrders})
            
            
        }else{
            res.redirect('/login')
        }
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
        console.log('hi',UserId)
        
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
        let total =  req.params.id
        let text1 = req.body.firstname
        let text2 = req.body.lastname
        let Fullname = text1.concat(text2)
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
                        totalPrice : total,
                        paymentStatus : "Pending",
                        Products : productArray,
                        Address : {
                            Fullname : Fullname,
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
                        totalPrice : total,
                        paymentStatus : "Pending",
                        Products : productArray,
                        Address : {
                            Fullname : Fullname,
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
            res.render('user/placedOrder',{user})
        }else{

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
                    Err = "The password is not matched"
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