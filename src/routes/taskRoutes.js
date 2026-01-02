const express = require('express')
const router = express.Router()
const {createTask,getTask} = require('../controllers/taskController')
const {middleware} = require('../middleware/middleware')

router.post('/',middleware,createTask)
router.get('/',middleware,getTask)

module.exports = router