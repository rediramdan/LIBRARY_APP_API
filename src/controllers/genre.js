const dataModels = require('../models/data')
const helper = require('../helpers')


module.exports = {
    getGenres: async function(request, response){
       try {
            const result = await dataModels.getAllData('genre')
            return helper.response(response, 200, result)
       } catch (error) {
           return helper.response(response, 500, error)
       }
    },
    getGenreById: async function(request, response){
        try {
             const id = request.params.id
             const result = await dataModels.getDataById('*','genre',id)
             return helper.response(response, 200, result)
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
    postGenre: async function(request, response){
        try {
             const setData = request.body
    
             const result = await dataModels.postData('genre',setData)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     putGenre: async function(request, response){
        try {
             const setData = request.body
             const id = request.params.id
             const result = await dataModels.putData('genre',setData,id)
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     deleteGenre: async function(request, response){
        try {
             const id = request.params.id
             const books =  await dataModels.getDataByIdCustom('image','books','id_genre = '+id)
             if(typeof books != 'undefined' || books.length != 0) await dataModels.deleteDataCustom('books','id_genre = '+id)
             
             const result = await dataModels.deleteData('genre',id)
             console.log(books)
             helper.deleteFile(books)

             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     }
}