const express = require('express')
const Route = express.Router()
const upload = require('../helpers/upload')
const middlewareAuth = require('../middleware/auth')
const middlewareAdmin = require('../middleware/admin')
const middlewareMember = require('../middleware/member')
const bookController = require('../controllers/books')

Route
    .get('/', bookController.getBooks) 
    .get('/:id', bookController.getBookById)
    .post('/',middlewareAuth,middlewareAdmin, upload , bookController.postBook)
    .put('/:id',middlewareAuth,middlewareAdmin, upload, bookController.putBook)
    .put('/transaction/:id',middlewareAuth,middlewareMember, bookController.transactionBook)
    .delete('/:id',middlewareAuth,middlewareAdmin, bookController.deleteBook) 

module.exports = Route