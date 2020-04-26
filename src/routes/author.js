const express = require('express')
const Route = express.Router()
const middlewareAuth = require('../middleware/auth')
const middlewareAdmin = require('../middleware/admin')

const authorController = require('../controllers/author')

Route
    .get('/', authorController.getAuthors) 
    .get('/:id', authorController.getAuthorById)
    .post('/',middlewareAuth,middlewareAdmin, authorController.postAuthor)
    .put('/:id',middlewareAuth,middlewareAdmin, authorController.putAuthor)
    .delete('/:id',middlewareAuth,middlewareAdmin, authorController.deleteAuthor) 

module.exports = Route