const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const promote = async (req,res) => {
    try{
        const {email} = req.body

        console.log(typeof email)

        if(!email){
            return res.status(401).json({Message:"Email is required"})
        }
        
        const user = await prisma.user.findUnique(
            {
                where:{email},
                include:{
                    userRoles:{
                        include:{role:true}
                    }
                }
            }
        )

        const editorRole = await prisma.role.findUnique({
            where:{name:"EDITOR"}
        })

        const currentRole = user.userRoles[0].role.name

        if(!user){
            return res.status(404).json({Message:"User not found"})
        }

        if (currentRole === "EDITOR"){
            return res.status(401).json({Message:"User is already eitor"})
        }

        if(user.orgId !== req.user.orgId){
            return res.status(401).json({Message:"User does not belong to the same organisation"})
        }

        if(user.status !== "ACTIVE"){
            return res.status(401).json({Message:"User is not approved yet"})
        }

        const updated = await prisma.userRole.update({
            where:{
                userId_orgId:{
                    userId:user.id,
                    orgId:user.orgId
                }
            },
            data:{roleId:editorRole.id}
        })

        res.json({
            Message:"Role updated",
            user:updated
        })
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({Error:"Server Error"})
    }
}

module.exports = {promote}