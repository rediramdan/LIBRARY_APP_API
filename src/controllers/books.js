const dataModels = require('../models/data')
const helper = require('../helpers')
const client = require('../config/redis')

module.exports = {
    getBooks: async function(request, response){
       try {
           let search_query = request.query.query
           const sort = request.query.sort
           const asc = request.query.asc
           let limit = request.query.limit
           let requestPage = request.query.requestPage

           //query where
           let query = 'WHERE books.id_author = author.id AND books.id_genre = genre.id';
           if(search_query != undefined){
             query += " AND books.title LIKE '%"+search_query+"%'";
           }


            //choose order methode
            let order = "ASC"
            if(asc == 'false'){
                order = "DESC" 
            }

           //sort with genre or author or created
           if(sort == 'genre'){
             query += " ORDER BY id_genre "+order;
           }else if(sort == 'author'){
             query += " ORDER BY id_author "+order;
           }else{
             query += " ORDER BY created_at "+order;
           }

            //set paginate
            if(limit == undefined || requestPage == undefined){
                limit = 2
                requestPage = 1
            }

            const offset = (requestPage - 1) * limit
            query += " LIMIT "+limit+" OFFSET "+offset

            const select = 'books.id,books.title,books.description,books.image,genre.name as genre_name, author.name as author_name,books.status,books.created_at,books.updated_at';
            const result = await dataModels.getAllDataJoin('books,author,genre',query,select)
            
            
            let amountTable = 'books '
            if(search_query != undefined){
                amountTable += " WHERE books.title LIKE '%"+search_query+"%'";
            }
            const data = await dataModels.getDataAmount(amountTable)
            const pagination = {
                dataAmount : data.amount,
                pageAmount : Math.ceil(parseInt(data.amount)/parseInt(limit)),
                limit : limit,
                currentPage : requestPage
            }

            const newQuery = (query).replace(" ","");
             client.get(`books:${newQuery}`, async (err, result) => {
                // If that key exist in Redis store
                if (result) {
                  const resultJSON = JSON.parse(result);
                  return helper.response(response, 200, resultJSON,pagination)
                } else { // Key does not exist in Redis store
                  // Fetch directly from Wikipedia API
                  const resultJ = await dataModels.getAllDataJoin('books,author,genre',query,select)
                  console.log(newQuery)
                  client.setex(`books:${newQuery}`, 3600, JSON.stringify(resultJ, null, 0), function(err,reply){
                    if(err) throw err  
                    console.log(reply)
                  });

                  return helper.response(response, 200, resultJ,pagination)
                }
            });

       } catch (error) {
           console.log(error)
           return helper.response(response, 500, error)
       }
    },
    getBookById: async function(request, response){
        try {
             const id = request.params.id
             const query = 'WHERE books.id_author = author.id AND books.id_genre = genre.id AND books.id = '+id;
             const select = 'books.id,books.title,books.description,books.image,genre.name as genre_name, author.name as author_name,books.status,books.created_at,books.updated_at';
             const result = await dataModels.getAllDataJoin('books,author,genre',query,select)
             const newResult = result[0]

             return helper.response(response, 200, newResult)
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
    postBook: async function(request, response){
        try {
             const setData = {
                 image : request.file.filename,
                 ...request.body
             }
             
             const result = await dataModels.postData('books',setData)
             client.flushdb(function(err,success){
                 console.log(success)
             })
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
     putBook: async function(request, response){
        try {
            const id = request.params.id
            const books = await dataModels.getDataByIdCustom('image','books', ' id = '+id)

            if(typeof books == 'undefined' || books.length == 0) throw new Error('invalid books id...')
            
            if(request.file != undefined){
                 setData = {
                    image : request.file.filename,
                    ...request.body
                }

                helper.deleteFile(books) 

            }else{

                 setData = request.body

            }
            const result = await dataModels.putData('books',setData,id)
            client.flushdb(function(err,success){
                console.log(success)
            })
            return helper.response(response, 200, result)

        } catch (error) {
            if(request.file != undefined) helper.deleteFile([{image : request.file.filename}])
            return helper.response(response, 500, error)
        }
     },
     transactionBook: async function(request, response){
         try {
            const id = request.params.id
            const setData = {
                status : request.body.status
            }

            const result = await dataModels.putData('books',setData,id)
            client.flushdb(function(err,success){
                console.log(success)
            })
            return helper.response(response, 200, result)

         } catch (error) {
             
         }
     },
     deleteBook: async function(request, response){
        try {
             const id = request.params.id
             const books = await dataModels.getDataByIdCustom('image','books', 'id = '+id)
             const result = await dataModels.deleteData('books',id)
             helper.deleteFile(books) 
             client.flushdb(function(err,success){
                console.log(success)
            })
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     }
}