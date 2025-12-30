const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()

// console.log(Object.keys(prisma))
// console.log("RUNNING SEED FILE:", __filename)
// console.log("PRISMA MODELS:", Object.keys(prisma))

async function main() {
    

    //permissions
    const permissions = [
        'task:create',
        'task:update',
        'task:delete',
        'user:invite',
        'org:manage'
    ]


    for (const key of permissions){
        await prisma.permission.upsert({
            where:{ key},
            update: {},
            create: {key}
        })
    }

    //Roles
    const roles = ['ADMIN','EDITOR','VIEWER']

    for (const name of roles){
        await prisma.role.upsert({
            where: {name},
            update: {},
            create: {name}
        })
    }

    //Attach permissions to roles
    const admin = await prisma.role.findUnique({where :{name: 'ADMIN'}})
    const editor = await prisma.role.findUnique({where:{name: 'EDITOR'}})
    const viewer = await prisma.role.findUnique({where:{name: 'VIEWER'}})

    const allperms = await prisma.permission.findMany()

    //Admin got everything
    for (const perm of allperms){
        await prisma.rolePermission.upsert({
            where:{
                roleId_permissionId:{
                    roleId: admin.id,
                    permissionId: perm.id
                }
            },
            update: {},
            create: {roleId: admin.id, permissionId: perm.id }
        })
    }

    //Editor permissions
    const editorKeys = ['task:create','task:update']
    for(const key of editorKeys){
        const perm = allperms.find(p => p.key === key)
        await prisma.rolePermission.upsert({
            where:{
                roleId_permissionId:{
                    roleId:editor.id,
                    permissionId:perm.id
                }
            },
            update:{},
            create: {roleId: editor.id, permissionId: perm.id}
        })
    }

    console.log("RBAC seeded successfully")
}

main()
    .catch(console.error)
    .finally(()=> prisma.$disconnect())