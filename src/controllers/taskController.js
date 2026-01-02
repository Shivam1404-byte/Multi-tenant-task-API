const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient

const createTask = async (req,res)=>{
    const {title,description,assignedToId} = req.body
    
    if(!title || !description || !assignedToId){
        return res.status(401).json({Message:"title,description and assigned Id is required"})
    }

    const task = await prisma.task.create({
        data:{
            title,
            description,
            createdById : req.user.id,
            assignedToId
        }
    });

    res.json({
        message:"Task created Successfully",
        Task:task
    })
}

const getTask = async (req,res)=>{
    const task = await prisma.task.findMany({
        where:{
            OR:[
                {createdById:req.user.id},
                {assignedToId:req.user.id}
            ]
        }
    })

    res.json({
        Tasks:task
    })
}

const updateTask = async (req,res)=>{
    try{
        const {title,description,status,assignedToId} = req.body
        const {id} = req.params
        const userId = req.user.id

        const task = await prisma.task.findUnique({
            where:{id:id}
        })

        if(!task){
            res.status(404).json({Error:"Task not found"})
        }

        const updateTask = await prisma.task.update({
            where:{id:task.id},
            data:{
                title:title,
                description:description,
                assignedToId:assignedToId,
                status:status
            }
        })

        res.json({
            Message:"Task Updated Successfully",
            updated_Task:updateTask
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({Error:"Server Error"})
    }
}

const deleteTask = async (req,res)=>{
    try{
        const userId = req.user.id
        const id = req.params

        const task = await prisma.task.findUnique({
            where:{id:id}
        })

        if(!task){
            res.status(404).json({Message:"Task not found"})
        }

        const deletetask = await prisma.task.delete({where:{id:task.id}})

        res.json({
            Message:"Task deleted successfully",
            deletetask
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({Error:"Server Error"})
    }
}

module.exports = {createTask,getTask,updateTask,deleteTask}