const express = require('express')
require('dotenv').config
const authRoute = require('./routes/authRoutes')

const app = express()
app.use(express.json())

const port = process.env.PORT || 5000

app.use('/auth',authRoute)


app.get('/',(req,res)=>{
    res.status(200).json({Message:"The server is running properly"})
})

app.listen(port,()=>{
    console.log("App is running")
})