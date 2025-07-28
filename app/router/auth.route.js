const express = require('express')
const router = express.Router()

const authController = require('../controller/auth.controller')
const upload = require('../middleware/avatarUpload')

router.post('/register',upload.single('profilePic'),authController.register)
router.get('/login',authController.login)
router.get('/verify/:token',authController.verifyEmail)


module.exports = router
