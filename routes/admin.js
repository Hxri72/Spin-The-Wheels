const express = require('express')

const router = express.Router()
const AdminControllers = require('../controllers/AdminControllers')


router.get('/',AdminControllers.getAdminlogin)

router.get('/adminhome',AdminControllers.getAdminHome)

router.get('/adminuser',AdminControllers.getAllUsers)

router.get('/userblock/:id',AdminControllers.getUserBlock)

router.get('/userUnblock/:id',AdminControllers.getUserUnblock)

router.get('/adminlogout',AdminControllers.getAdminlogout)

router.post('/adminlogin',AdminControllers.PostAdminlogin)



module.exports = router