const express = require('express')
const router = express.Router()
const {createTask,getTask, updateTask,deleteTask} = require('../controllers/taskController')
const {middleware,permission} = require('../middleware/Middleware')

router.post('/',middleware,permission("task:create"),createTask)
router.get('/',middleware,getTask)
router.put('/:id',middleware,permission("task:update"),updateTask)
router.delete('/:id',middleware,permission("task:delete"),deleteTask)

module.exports = router