const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authController = require('../middlewares/auth')
const productController = require('../controllers/productController')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/user/:id/profile', authController.authentication, authController.authorization, userController.getUser)
router.put('/user/:id/profile', authController.authentication, authController.authorization, userController.updateUser)

// Product Routes

router.post('/products', productController.products)

module.exports = router