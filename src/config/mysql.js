const mysql = require('mysql')
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

connection.connect(function(error){
    if (error) throw error 
    console.log('Database has connected..')
})

module.exports = connection