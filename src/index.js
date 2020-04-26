const express = require('express')
const Route = express.Router()

const authorRoutes = require('./routes/author')
const genreRoutes = require('./routes/genre')
const bookRoutes = require('./routes/books')
const authRoutes = require('./routes/auth')

Route.use('/genre', genreRoutes)
Route.use('/author', authorRoutes)
Route.use('/book', bookRoutes)
Route.use('/auth', authRoutes)



module.exports = Route