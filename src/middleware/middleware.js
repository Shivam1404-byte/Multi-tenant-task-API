const jwt = require('jsonwebtoken')
require('dotenv').config()
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const middleware = async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]

        if(!token){
            return res.status(401).json({Message:"Token not provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await prisma.user.findUnique({where:{id:decoded.userId}})

        if (!user){
            return res.status(404).json({Message:"User not found"})
        }

        if (user.orgId !== decoded.orgId){
            return res.status(401).json({Message:"Token Invalid"})
        }

        if (user.status != 'ACTIVE'){
            return res.status(400).json({Message:"Account not active"})
        }

        req.user = {
            id: user.id,
            role: user.role,
            orgId: user.orgId
        }
        next()
    }
    catch(err){
        res.status(500).json({Error:"Token not provided"})
    }
}

const errorHandler = (err,req,res,next) => {
    console.error(err.stack)

    if(err.name === 'JsonWebTokenError'){
        return res.status(401).json({Error:"Invalid token"})
    }

    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({Error:"Token Expired"})
    }

    res.status(500).json({Error:"Something went wrong"})
}

module.exports = {middleware,errorHandler}