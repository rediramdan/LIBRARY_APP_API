const dataModels = require('../models/data')
const helper = require('../helpers')


module.exports = {
    getAuthors: async function(request, response){
       try {
            const result = await dataModels.getAllData('author')
            return helper.response(response, 200, result)
       } catch (error) {
           return helper.response(response, 500, error)
       }
    },
    getAuthorById: async function(request, response){
        try {
             const id = request.params.id
             const result = await dataModels.getDataById('*','author',id)
             return helper.response(response, 200, result)
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
    postAuthor: async function(request, response){
        try {
             const setData = request.body
             const result = await dataModels.postData('author',setData)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     putAuthor: async function(request, response){
        try {
             const setData = request.body
             const id = request.params.id
             const result = await dataModels.putData('author',setData,id)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     deleteAuthor: async function(request, response){
        try {
             const id = request.params.id
             const books =  await dataModels.getDataByIdCustom('image','books','id_author = '+id)
             if(typeof books != 'undefined' || books.length != 0) await dataModels.deleteDataCustom('books','id_author = '+id)
             
             const result = await dataModels.deleteData('author',id)
             helper.deleteFile(books)
             
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     }


}