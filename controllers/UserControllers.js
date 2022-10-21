const userModel = require('../models/user')
const userStatus = require('../models/user')
const bcrypt = require('bcrypt')
const {USER_COLLECTION}= require('../config/collection')

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
            let user = req.session.user
            res.render('user/index',{user})
        }else{
           res.render('user/index',{user:false})   
        }
        
    },
    getUserSignup:(req,res)=>{

        res.render('user/signup',{Err})
    },
    getUserShop:(req,res)=>{
        res.render('user/shop')
    },
    getUserlogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    },
    PostUsersignup:(req,res)=>{ 
        userModel.find({Email:req.body.Email},async(err,data)=>{
        console.log(data);
            if(data.length==0){

                // Confirm password validation
                if(req.body.Password===req.body.ConfirmPassword)
                {
                    //inserting the data into database
                    const user = new userModel ({
                        firstname:req.body.firstname,
                        lastname:req.body.Lastname,
                        Email:req.body.Email,
                        Password: await bcrypt.hash(req.body.Password,10),
                        userStatus:"active"
    
                    })
                    user.save()
                    .then(result=>{
                        loggedIn =true
                        req.session.user = user
                        
                        res.redirect('/')
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }else{
                    console.log('err');
                    Err = "The password is not matched"
                    res.redirect('/signup')
                }
                
            }else{
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