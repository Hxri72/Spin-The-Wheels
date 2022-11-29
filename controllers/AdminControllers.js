const ADMIN_COLLECTION = require('../config/collection')
const USER_COLLECTION = require('../config/collection')
const adminModel = require('../models/admin')
const userModel = require('../models/user')
const categoryModel = require('../models/category')
const productModel = require('../models/product')
const bannerModel = require('../models/banner')
const destinationModel = require('../models/destination')
const orderModel = require('../models/order')
const newsModel = require('../models/news')
const couponModel = require('../models/coupon')
const bcrypt = require('bcrypt')
const destination = require('../models/destination')



let adminloginErr;
let categoryErr;

module.exports = {
    getAdminlogin:(req,res)=>{
        let admin = req.session.admin
        res.render('admin/Admin-login',{adminloginErr})
    },
    getdashboardDetails:async(req,res)=>{
        let result1 = {
            cancelledOrders : "0",
            completedOrders : "0",
            pendingOrders : "0"
        }
        const cancelledOrders = await orderModel.aggregate(
            [

                {$match : {"paymentStatus" : 'Cancelled'}  },

                {$count : 'totalcount' }
            ]
        )

        const completedOrders = await orderModel.aggregate(
            [

                {$match : {"paymentStatus" : "Delivered"}},

                {$count : 'totalcount' }
            ]
        )

        const pendingOrders = await orderModel.aggregate(
            [

                {$match : {$or :[
                {"paymentStatus" : "Pending"},
                {"paymentStatus" : "Placed"},
                {"paymentStatus" : "Shipped"}]}},

                {$count : 'totalcount' }
            ]
        )
        if(cancelledOrders.length===0){
            result1.cancelledOrders = [{totalcount : 0}]
        }else{
            result1.cancelledOrders = cancelledOrders
        }
        if(completedOrders.length===0){
            result1.completedOrders = [{totalcount : 0}]
        }else{
            result1.completedOrders = completedOrders
        }
        if(pendingOrders.length===0){
            result1.pendingOrders = [{totalcount : 0}]
        }else{
            result1.pendingOrders = pendingOrders
        }
        res.json(result1)
    },
    getdashboardBar:async(req,res) => {
        let result = {
            users : '0',
            Profit : '0',
            totalSales : '0'
        }

        const users = await userModel.aggregate(
            [
                {$count : 'totalcount'}
            ]
        
        )

        const profit = await orderModel.aggregate(
            [
                {$match : {$or :[
                    {"paymentStatus" : "Pending"},
                    {"paymentStatus" : "Placed"},
                    {"paymentStatus" : "Shipped"},
                    {"paymentStatus" : "Delivered"}]}},
                
            ]
        )

        const dates = await orderModel.aggregate(
            [
                {$group : 
                {_id : "$Date",
                totalPrice : {
                    "$sum" : "$totalPrice"
            }
            },
                 
        },

                {$sort : {_id : -1}}
            ]
        ).limit(4)
        dates.reverse()
        
        let   totalSales = 0

        for(let i=0;i<profit.length;i++){
            totalSales = profit[i].totalPrice + totalSales
        }

        let Profit = (totalSales*12)/100

        result.users = users
        result.totalSales = totalSales
        result.Profit = Profit
        result.dates = dates

        res.json(result)
    },
    getAdminHome:async(req,res) => {
        res.render('admin/Admin-home')
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
        destinationModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Destination',{result})
            }
        })
    },
    getAdminNews : (req,res) =>{
        newsModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-News',{result})
            }
        })
    },
    getaddCoupon : (req,res) =>{
        res.render('admin/Add-Coupon')
    }, 
    getadminCoupon : (req,res) => {
        couponModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Coupon',{result})
            }
        })
        
    },
    getadminSales : (req,res) => {
        orderModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Sales',{result})
            }
        })
        
    },
    geteditCoupon : (req,res) => {
        couponModel.find({_id:req.params.id},(err,result)=>{

            if(err){
                console.log(err)
            }else{
                res.render('admin/Edit-Coupon',{result})
            }
        })
    },
    getAddNews : (req,res)=>{
        res.render('admin/Add-News')
    },
    getAdminOrders:(req,res)=>{
        orderModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Order',{result})
            }
        })
    },
    getaddDestinations : (req,res) => {
        res.render('admin/Add-Destinations',{result:false})
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
    getEditDestination:(req,res)=>{
        destinationModel.find({_id:req.params.id},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.render('admin/Edit-Destination',{result})
            }
        })
    },
    getEditbanner:(req,res)=>{
        bannerModel.find({_id:req.params.id},function(err,result){
            if(err){
                console.log('err')
            }else{
                res.render('admin/Edit-Banner',{result})
            }
        })
    },
    getViewOrders:(req,res)=>{
        let orderId = req.params.id
        orderModel.find({_id:orderId},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/View-Orders',{result})
            }
        })
        
    },
    getplacedOrders:async(req,res)=>{
        let orderId = req.params.id
        await orderModel.updateOne({_id:orderId},{
            $set:{
                paymentStatus : "Placed"
            }
        })
        res.redirect(`/admin/viewOrders/${orderId}`)
    },
    getshippedOrders:async(req,res)=>{
        let orderId = req.params.id
        await orderModel.updateOne({_id:orderId},{
            $set:{
                paymentStatus : "Shipped"
            }
        })
        res.redirect(`/admin/viewOrders/${orderId}`)
    },
    getdeliveredOrders:async(req,res)=>{
        let orderId = req.params.id
        await orderModel.updateOne({_id:orderId},{
            $set:{
                paymentStatus : "Delivered"
            }
        })
        res.redirect(`/admin/viewOrders/${orderId}`)
    },
    getcancelledOrders:async(req,res)=>{
        let orderId = req.params.id
        await orderModel.updateOne({_id:orderId},{
            $set:{
                paymentStatus : "Cancelled"
            }
        })
        res.redirect(`/admin/viewOrders/${orderId}`)
    },
    getSoftDeleteProduct:async(req,res)=>{
        let productId = req.params.id
        await productModel.updateOne({_id:productId},{
            $set:{
                productStatus:"false"
            }
        })
        res.json({status:true})
    },
    getSoftDeleteBanner:async(req,res)=>{
        let bannerId = req.params.id
        await bannerModel.updateOne({_id:bannerId},{
            $set:{
                bannerStatus:"false"
            }
        })
        res.json({status:true})
    },
    getUndoSoftDeleteBanner:async(req,res)=>{
        let bannerId = req.params.id
        await bannerModel.updateOne({_id:bannerId},{
            $set:{
                bannerStatus:"true"
            }
        })
        res.redirect('/admin/adminBanner')
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
    getdeleteDestination:async(req,res)=>{
        let destinationId = req.params.id
        await destinationModel.deleteOne({_id:destinationId})
        res.json({status:true})
    },
    getdeleteNews:async(req,res)=>{
        let newsId = req.params.id
        await newsModel.deleteOne({_id:newsId})
        res.json({status:true})
    },
    getdeleteCoupon:async(req,res)=>{
        let couponId = req.params.id
        await couponModel.deleteOne({_id:couponId})
        res.json({status:true})
    },
    getUserBanner:(req,res)=>{
        bannerModel.find({},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Admin-Banner',{result})
            }
        })
        
    },
    getAddBanner:(req,res)=>{
        res.render('admin/Add-Banner',{result:false})
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
        let Category = req.params.category
        productModel.find({category:Category},async(err,data)=>{
            if(data.length!==0){
                res.json({status:false})
            }else{
                await categoryModel.deleteOne({category:Category})
                res.json({status:true})
            }
        })
    },
    getCategoryProduct:(req,res)=>{
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
    geteditNews : (req,res) => {
        newsModel.find({_id:req.params.id},(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.render('admin/Edit-News',{result})
            }
        })
    },
    postAddBanner:(req,res)=>{
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        const banner = new bannerModel({
            Section : req.body.Section,
            bannerImg : imagename,
            bannerStatus : "true"
        })
        banner.save()
        res.redirect('/admin/adminbanner')


    },
    postAddNews : (req,res) => {
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }

        const news = new newsModel({
            Headline : req.body.Headline,
            Description : req.body.Description,
            NewsImg : imagename
        })
        news.save()
        res.redirect('/admin/adminnews')
    },
    postAddDestination:(req,res)=>{
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        const destination = new destinationModel({
            Route : req.body.destination,
            Description : req.body.description,
            CommonRoute : req.body.commonroute,
            RidingDistance : req.body.ridingdistance,
            BestRidingSeason : req.body.ridingseason,
            RouteImg : imagename
        })
        destination.save()
        res.redirect('/admin/admindestinations')

    },
    postEditDestination:(req,res)=>{
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        destinationModel.find({id:req.params.id},async(err,data)=>{
            if(data.length!==0){
                await destinationModel.updateOne({_id:req.params.id},{
                    $set : {
                        Route : req.body.Route,
                        Description : req.body.Description,
                        CommonRoute : req.body.commonroute,
                        RidingDistance : req.body.ridingdistance,
                        BestRidingSeason : req.body.ridingseason,
                        RouteImg : imagename
                    }
                })
                res.redirect('/admin/admindestinations')
            }else{
                console.log(err)
            }
        })
    },
    postEditBanner:(req,res)=>{
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        bannerModel.find({_id:req.params.id},async(err,data)=>{
            if(data.length!==0){
                await bannerModel.updateOne({_id:req.params.id},{
                    $set:{
                        Section:req.body.Section,
                        bannerImg:imagename
                    }
                })
                res.redirect('/admin/adminBanner')
            }else{
                console.log(err)
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
        productModel.find({_id:req.params.id},async(err,data)=>{
            if(data.length!==0){
                await productModel.updateOne({_id:req.params.id},{
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
    postEditNews:(req,res) => {
        const imagename = []
        for(file of req.files){
            imagename.push(file.filename)
        }
        newsModel.find({_id:req.params.id},async(err,data)=>{
            if(data!==0){
                await productModel.updateOne({_id:req.params.id},{
                    $set:{
                        Headline : req.body.Headline,
                        Description : req.body.Description,
                        NewsImg : imagename
                    }
                })
                res.redirect('/admin/adminnews')
            }else{
                console.log(err)
            }
            
        })
    },
    postEditCoupon : (req,res) => {
        couponModel.find({_id:req.params.id},async(err,data)=>{
            if(data!==0){
                await couponModel.updateOne({_id:req.params.id},{
                    $set:{
                    CouponName:req.body.CouponName,
                    CouponCode:req.body.CouponCode,
                    Percentage:req.body.Percentage,
                    Minamount:req.body.Minamount,
                    Maxamount:req.body.Maxamount,
                    Description:req.body.Description,
                    ExpiryDate:req.body.Date
                    }
                })
                res.redirect('/admin/admincoupon')
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
    postaddCoupon : (req,res) => {
        couponModel.find({CouponCode:req.body.CouponCode},(err,data)=>{
            if(data.length===0){
                const coupon = new couponModel ({
                    CouponName:req.body.CouponName,
                    CouponCode:req.body.CouponCode,
                    Percentage:req.body.Percentage,
                    Minamount:req.body.Minamount,
                    Maxamount:req.body.Maxamount,
                    Description:req.body.Description,
                    ExpiryDate:req.body.Date
                })
                coupon.save()
                .then(result=>{
                    res.redirect('/admin/admincoupon')
                })
                .catch(err=>{
                    console.log(err)
                })
            }else{
                req.session.couponErr = "Coupon already added"
                res.redirect('/admin/admincoupon')
            }
        })
    },
    PostAdminlogin :async (req,res) => {
        let Admin = await adminModel.findOne({Username:req.body.Username}).lean()
        if(Admin){
            if(Admin.Password===req.body.Password){
                req.session.adminloggedIn = true
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