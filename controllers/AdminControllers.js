const ADMIN_COLLECTION = require('../config/collection')
const USER_COLLECTION = require('../config/collection')
const adminModel = require('../models/admin')
const userModel = require('../models/user')
const categoryModel = require('../models/category')
const productModel = require('../models/product')
const bcrypt = require('bcrypt')



let loggedIn ;
let adminloginErr;
let categoryErr;

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
        res.json({status:true})
        // res.redirect('/admin/adminuser')
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
    getAdminCategory:(req,res)=>{
        res.render('admin/Admin-Category',{categoryErr})
        categoryErr = null 
    },
    getAdminProduct:(req,res)=>{
        productModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Product',{result})
            }
        })
    },
    getAdminDestinations : (req,res)=>{
        res.render('admin/Admin-Destination')
    },
    getEditProduct:(req,res)=>{
        productModel.find({_id:req.params.id},function(err,result){
            if(err){
                console.log('err')
            }else{
                res.render('admin/Edit-Product',{result})
            }
        })
        
    },
    getSoftDeleteProduct:async(req,res)=>{
        let productId = req.params.id
        await productModel.updateOne({_id:productId},{
            $set:{
                productStatus:"false"
            }
        })
        res.json({status:true})
        // res.redirect('/admin/adminproduct')
    },
    getUndoSoftDeleteProduct:async(req,res)=>{
        let productId = req.params.id
        await productModel.updateOne({_id:productId},{
            $set:{
                productStatus:"true"
            }
        })
        res.redirect('/admin/adminproduct')
    },
    getdeleteProduct:async(req,res)=>{
        let productId = req.params.id
        await productModel.deleteOne({_id:productId})
        res.json({status:true})
        // res.redirect('/admin/adminproduct')
    },
    getAdminlogout:(req,res)=>{
        req.session.destroy();
        loggedIn = false;
        res.redirect('/admin')
    },
    getAllCategory:async(req,res)=>{
        categoryModel.find({},function(err,result){
            if(err){
                res.send('err')
            }else{
                res.render('admin/Admin-Category',{result,categoryErr})
                categoryErr = null
            }
        })
    },
    getdeleteCategory:async(req,res)=>{
        let categoryId = req.params.id
        await categoryModel.deleteOne({_id:categoryId})
        res.redirect('/admin/admincategory')

    },
    getCategoryProduct:(req,res)=>{
        console.log(req.params.category)
        let categoryName = req.params.category
        productModel.find({category:categoryName},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Product',{result})
            }
        })
    },
    getaddProduct:(req,res)=>{
        categoryModel.find({},function(err,result){
            if(err){
                console.log('err')
            }else{
                res.render('admin/Add-Product',{result})
            }
        })
        
    },
    postAddProduct:(req,res)=>{
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        const product = new productModel({
            productname:req.body.productname,
            category:req.body.category,
            description:req.body.description,
            quantity:req.body.quantity,
            price:req.body.price,
            productImg:imagename,
            productStatus:"true"
        })
        product.save()
        res.redirect('/admin/adminproduct')
    },
    postEditProduct:(req,res)=>{
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        productModel.find({_id:req.params.id},(err,data)=>{
            if(data.length!==0){
                productModel.updateOne({_id:req.params.id},{
                    $set:{
                        productname:req.body.productname,
                        category:req.body.category,
                        description:req.body.description,
                        quantity:req.body.quantity,
                        price:req.body.price,
                        productImg:imagename
                    }
                })
                res.redirect('/admin/adminproduct')
            }else{
                console.log(err)
            }
        })
    },
    postAddCategory:(req,res)=>{
        categoryModel.find({category:req.body.category},(err,data)=>{
            if(data.length===0){
                const category = new categoryModel({
                    category:req.body.category
                })
                category.save()
                .then(result=>{
                    res.redirect('/admin/admincategory')
                })
                .catch(err=>{
                    console.log(err);
                })
            }else{
                categoryErr = "Category already added"
                res.redirect('/admin/admincategory')
            }
        }
        )
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