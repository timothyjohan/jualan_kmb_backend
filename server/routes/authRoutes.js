const express = require('express')
const router = express.Router()
const { register, login, logout, validate } = require('../controllers/authController')
const auth = require('../middleware/auth')

// Routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', auth, logout)
router.get('/validate', auth, validate)

module.exports = router 