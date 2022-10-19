// const { urlencoded } = require("body-parser");
const express = require("express");
const UserControllers = require("../controllers/UserControllers");
const router = express.Router();

router.get("/", UserControllers.getUserHome);

router.get('/signup',UserControllers.getUserSignup)

router.get('/login',UserControllers.getUserlogin)

router.get('/shop',UserControllers.getUserShop)

router.get('/logout',UserControllers.getUserlogout)

router.post('/signup',UserControllers.PostUsersignup)

router.post('/login',UserControllers.PostUserlogin)


module.exports = router;
