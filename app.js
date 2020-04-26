const express = require('express')
var cors = require('cors');
var dotenv = require('dotenv');
dotenv.config()

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const routeNavigator = require('./src/index')

const server = app.listen('3000','127.0.0.1', function(){
    const address = server.address().address
    const port = server.address().port

    console.log('Listening port at '+address+':'+port)
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
  origin: 'http://yourapp.com'
}));
app.use('/', routeNavigator)
