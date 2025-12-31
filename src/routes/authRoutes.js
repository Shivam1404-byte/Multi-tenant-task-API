const {register,login,approveUser} = require('../controllers/authController')
const {promote,demote} = require('../controllers/changeRole')
const {requireAdmin} = require('../middleware/requireAdmin')
const {middleware} = require('../middleware/middleware')
const express = require('express')

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/approveUser',middleware,requireAdmin,approveUser)
router.post('/promote',middleware,requireAdmin,promote)

module.exports = router