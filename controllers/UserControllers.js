const userModel = require('../models/user')
const userStatus = require('../models/user')
const bcrypt = require('bcrypt')
const {USER_COLLECTION}= require('../config/collection')
const otpverification = require('../utils/otpgenerator')
const productModel = require('../models/product')

let loggedIn = false
let Err = null;
let loginErr;

module.exports = {
    getUserlogin : (req,res)=>{

        res.render('user/login',{loginErr})
        loginErr = null
    },
    getUserHome : (req,res)=>{
        if(loggedIn){
            productModel.find({},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let user = req.session.user
                    res.render('user/index',{user,result})
                }
            })
        }else{
            productModel.find({},(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    res.render('user/index',{user:false,result})
                }
            })
            
        }
        
    },
    getUserSignup:(req,res)=>{

        res.render('user/signup',{Err})
    },
    getUserProfile:(req,res)=>{
        let user = req.session.user
        
        res.render('user/profile',{user})
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
    getProductDetails:(req,res)=>{
        let user = req.session.user
        res.render('user/product-details',{user})
    },
    getUserlogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    },
    getOtp:(req,res)=>{
        res.render('user/otp')
    },
    PostUserOtp:(req,res)=>{
        const joinedbody=req.body.num1.join("")
        if(req.session.otpgenerator===joinedbody){
            const user = userModel.create(req.session.otp)
            req.session.user = user
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