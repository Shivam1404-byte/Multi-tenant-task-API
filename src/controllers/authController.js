const jwt = require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()
const prisma = new PrismaClient()


const register = async (req,res)=>{
    const {email,password,orgName} = req.body
    try{

        if(!email || !password || !orgName){
            return res.status(400).json({Message:"Email, password and organisation are required"})
        }

        const userExist = await prisma.user.findUnique({where:{ email }})

        if(userExist){
            return res.status(401).json({message:"User already Exist"})
        }

        if (password.length < 6){
            return res.status(401).json({Message:"Your password is too short"})
        }

        const passwordHash = await bcrypt.hash(password,10)

        const result = await prisma.$transaction( async (tx) => {
            let org = await tx.organisation.findUnique({
                where:{name:orgName}
            })

            const newUserOrg = !org


            if(!org){
                org = await tx.organisation.create({
                    data: {name:orgName}
                })
            }

            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash:passwordHash,
                    orgId:org.id
                }
            })

            if(newUserOrg){
                const adminRole = await tx.role.findUnique({where:{'name': 'ADMIN'}})

                await tx.userRole.create({
                    data:{
                        userId:user.id,
                        orgId:org.id,
                        roleId:adminRole.id
                    }
                })

                await tx.user.update({
                    where:{email:email},
                    data:{
                        status:"ACTIVE"
                    }
                })
            }
            else{
                const Role = await tx.role.findUnique({where:{'name': 'VIEWER'}})

                await tx.userRole.create({
                    data:{
                        userId:user.id,
                        orgId:org.id,
                        roleId:Role.id
                    }
                })
            }

            return {user,org}
        })
        
        const token = jwt.sign(
            {userId:result.id,orgId:result.orgId},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.json({
            Message:"User created successfully",
            User:result.user,
            token
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:error.message})
    }
}

const login = async (req,res)=>{
    const {email,password,Role:requestedRole} = req.body
    try{
        if (!email || !password || !requestedRole) {
            res.status(401).json({Message:"Email, Password and Role are required"})
        }

        const user = await prisma.user.findUnique(
            {where:{email},
            include:{
                userRoles:{
                    include:{
                        role:true
                    }
                }
            }
            }
        );

        if (!user){
            return res.status(400).json({Message:"Invalid Credentials"})
        }

        const validPassword = await bcrypt.compare(password,user.passwordHash)

        if(!validPassword){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const allowedRoles = user.userRoles.map(r => r.role.name)



        if(!allowedRoles.includes(requestedRole)){
            return res.status(401).json({message:"You are not allowed to login as this role"})
        }

        if (user.status == 'PENDING'){
            return res.status(401).json({Message:"Admin has not approved to join yet!!"})
        }

        const token = jwt.sign(
            {userId:user.id,orgId:user.orgId},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.json({
            message:"Login Successful",
            token,
            user:{id:user.id,email:user.email,role:requestedRole}
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({Error:"Server Error"})
    }
}

const approveUser = async (req,res)=>{
    const {email} = req.body

    if(!email){
        return res.status(401).json({message:"Email is required"})
    }

    const user = await prisma.user.findUnique({where:{email}})

    if(!user){
        return res.status(404).json({Error:"User not found"})
    }

    if(user.orgId == req.user.orgId){
        return res.status(401).json({Error:"You are not allowed to change the status of another organisation"})
    }

    if (user.status != 'PENDING'){
        return res.status(400).json({Error:"User is not pending"})
    }

    const updatedUser = await prisma.user.update({
        where:{email:email},
        data:{
            status:'ACTIVE'
        }
    })

    res.json({
        success:true,
        Message:"User updated Successfully",
        user:updatedUser
    })
}

module.exports = {register,login,approveUser}