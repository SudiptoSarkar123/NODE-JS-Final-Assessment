const express = require('express')
const app = express();
const path = require('path')
const dotenv = require('dotenv').config()
const dbcon = require('./app/config/dbcon')
dbcon()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const blogRoute = require('./app/router/blog.route')
const authRoute = require('./app/router/auth.route')


app.use('/api/v1/blog',blogRoute)
app.use('/api/v1/auth',authRoute)




const port = process.env.PORT || 4001 ;
app.listen(port , ()=>{
    console.log('✅Server is running ...',port)
})