const {register,login,approveUser} = require('../controllers/authController')
const requireAdmin = require('../middleware/requireAdmin')
const express = require('express')

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/approveUser',requireAdmin,approveUser)

module.exports = router