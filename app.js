const express = require('express')
const path = require('path')
const ejs = require('ejs')
const app = express()
const mongoose = require('./config/connection')
const session = require('express-session')
const nocache = require('nocache')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const { appendFile } = require('fs/promises')

app.use(session({secret:"key",cookie:{maxAge:600000}}))
app.use(express.urlencoded())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(nocache())

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));

app.use('/',userRouter)
app.use('/admin',adminRouter)



//cache
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});





app.listen(5000,()=>{
    console.log('Server running on port 5000')
})

module.exports = app