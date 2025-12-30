const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv').config

const requireAdmin = async (req,res,next)=>{

    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({Message:"Admin only"})
    }
    next()
}

module.exports = requireAdmin