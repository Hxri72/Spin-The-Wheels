const ADMIN_COLLECTION = require('../config/collection')
const USER_COLLECTION = require('../config/collection')
const adminModel = require('../models/admin')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')


let loggedIn ;
let adminloginErr;

module.exports = {
    getAdminlogin:(req,res)=>{
        if(loggedIn){
            let admin = req.session.admin
            res.render('admin/Admin-home',{admin})
        }else{
            res.render('admin/Admin-login',{adminloginErr})
            adminloginErr = null
        }
        
    },
    getAdminHome:(req,res) => {
        if(loggedIn){
            res.render('admin/Admin-home')  
        }else{
            res.render('/admin')
        }
        
    },
    getAdminUser:(req,res)=>{
        res.render('admin/Admin-User')
    },
    getAllUsers:async(req,res)=>{ 
        userModel.find({},function(err,result){
            if(err){
                res.send(err)
            }else{
                res.render('admin/Admin-User',{result})
            }
        })
        
        
    },
    getUserBlock:async(req,res)=>{
        let userId = req.params.id
        await userModel.updateOne({_id:userId},{
            $set:{
                userStatus : "block"
                
            }
        })
        res.redirect('/admin/adminuser')
    },
    getUserUnblock:async(req,res)=>{
        let userId = req.params.id
        await userModel.updateOne({_id:userId},{
            $set:{
                userStatus : "active"
            }
        })
        res.redirect('/admin/adminuser')
    },
    getAdminlogout:(req,res)=>{
        req.session.destroy();
        loggedIn = false;
        res.redirect('/admin')
    },
    PostAdminlogin :async (req,res) => {
        let Admin = await adminModel.findOne({Username:req.body.Username}).lean()
        if(Admin){
            if(Admin.Password===req.body.Password){
                loggedIn = true
                req.session.admin = Admin
                res.redirect('/admin/adminhome')
            }else{
                adminloginErr = "Invalid Email or Password"
                res.redirect('/admin')
            }           
        }else{
            adminloginErr = "Invalid Email or Password"
            res.redirect('/admin')
        }
    }
}