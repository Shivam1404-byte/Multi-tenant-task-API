const jwt = require('jsonwebtoken')
require('dotenv').config()

const middleware = async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split
    }
    catch(err){
        res.status(500).json({Error:"Token not provided"})
    }
}