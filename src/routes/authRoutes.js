const {register,login,approveUser} = require('../controllers/authController')
const {requireAdmin} = require('../middleware/requireAdmin')
const {middleware} = require('../middleware/middleware')
const express = require('express')

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/approveUser',middleware,requireAdmin,approveUser)

module.exports = router