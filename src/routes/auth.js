const express = require('express')
const Route = express.Router()

const authController = require('../controllers/auth')

Route
    .post('/register', authController.register)
    .post('/login', authController.login)
    .post('/logout', authController.logout)
    .post('/token', authController.token)

module.exports = Route