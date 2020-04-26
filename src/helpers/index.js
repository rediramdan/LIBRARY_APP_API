const dataModels = require('../models/data')
const fs = require('fs')

module.exports = {
    response: function (response, status, data, pagination){
        const result = {}
        result.status = status || 200
        result.data = data
        result.pagination = pagination

        return response.status(result.status).json(result)
    },
    deleteFile: function(books){
        if(books.length != 0){
            books.forEach( async function(book){ 
                fs.stat(__dirname+'../../public/images/'+book.image, function (err, stats) {
                    console.log(stats);//here we got all information of file in stats variable
                
                    if (err) {
                        return console.error(err);
                    }
                
                    fs.unlink(__dirname+'../../public/images/'+book.image,function(err){
                        if(err) return console.log(err);
                        console.log('file deleted successfully');
                    });  
                });
             });
         }
    }

}