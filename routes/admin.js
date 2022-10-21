const express = require('express')

const router = express.Router()
const AdminControllers = require('../controllers/AdminControllers')


router.get('/',AdminControllers.getAdminlogin)

router.get('/adminhome',AdminControllers.getAdminHome)

router.get('/adminuser',AdminControllers.getAllUsers)

router.get('/admincategory',AdminControllers.getAllCategory)

router.get('/userblock/:id',AdminControllers.getUserBlock)

router.get('/userUnblock/:id',AdminControllers.getUserUnblock)

router.get('/adminlogout',AdminControllers.getAdminlogout)

router.get('/deletecategory/:id',AdminControllers.getdeleteCategory)

router.post('/addCategory',AdminControllers.postAddCategory)

router.post('/adminlogin',AdminControllers.PostAdminlogin)



module.exports = router