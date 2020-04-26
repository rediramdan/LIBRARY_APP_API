const express = require('express')
const Route = express.Router()
const middlewareAuth = require('../middleware/auth')
const middlewareAdmin = require('../middleware/admin')

const genreController = require('../controllers/genre')

Route
    .get('/', genreController.getGenres) 
    .get('/:id', genreController.getGenreById)
    .post('/',middlewareAuth,middlewareAdmin, genreController.postGenre)
    .put('/:id',middlewareAuth,middlewareAdmin, genreController.putGenre)
    .delete('/:id',middlewareAuth,middlewareAdmin, genreController.deleteGenre) 

module.exports = Route