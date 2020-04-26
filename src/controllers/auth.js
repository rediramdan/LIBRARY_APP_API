const dataModels = require('../models/data')
const helper = require('../helpers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10)

const refreshTokens=[]

module.exports = {
    register: async function(request, response){
        try {
             let setData = request.body
                 setData.password = bcrypt.hashSync(request.body.password, salt)
                 setData.role = 0;
             
             const result = await dataModels.postData('users',setData)
             delete result.password
             return helper.response(response, 200, result)
             
        } catch (error) {
            return helper.response(response, 500, error)
        }
     },
    login: async function(request, response){
        try {
            // Read username and password from request body
            const { username, password } = request.body;
            // Filter user from the users array by username and password
            const users = await dataModels.getDataByIdCustom('*','users',' username="'+username+'"');
            const user = users[0]
            const apikey = process.env.API_KEY
            const keyRefresh = process.env.API_KEY_REFRESH
            console.log(apikey)
            if(user === undefined){
                return helper.response(response, 401, {message:"username not found"})
            }else{
                if(bcrypt.compareSync(password,user.password)){
                    // Generate an access token
                    delete user.password
                    const accessToken = jwt.sign({id:user.id,username: user.username,name:user.nama,role:user.role}, apikey, {expiresIn:'5m'});
                    const refreshToken = jwt.sign({id:user.id,username: user.username,name:user.nama,role:user.role}, keyRefresh);
                    const result = {
                        ...user,
                        accessToken,
                        refreshToken
                    }
                    refreshTokens.push(refreshToken)
                    console.log(refreshTokens)
                    return helper.response(response, 200, result)
                }else{
                    return helper.response(response, 401, {message:"wrong passsword"})
                }
            }
       } catch (error) {
           console.log(error)
           return helper.response(response, 500, error)
       }
     },
     token: async function(request, response){
        try {
             const keyRefresh = process.env.API_KEY_REFRESH
             const apikey = process.env.API_KEY
             const {token} = request.body
             if(!token){
                return helper.response(response, 401, {message:"Unauthorization"})
             }
             console.log(refreshTokens)
             if(!refreshTokens.includes(token)){
                return helper.response(response, 403, {message:"Forbidden"})
             }

             jwt.verify(token, keyRefresh, (error,user) => {
                 if(error){
                    return helper.response(response, 403, {message:"Forbidden"})
                 }

                 const accessToken = jwt.sign({id:user.id,username: user.username,name:user.nama,role:user.role}, apikey, {expiresIn:'5m'})
                    return helper.response(response, 200, {
                        accessToken
                 })
             })
             
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     },
     logout: async function(request, response){
        try {
             const {token} = request.body
             refreshTokens.filter(token => t !== token)
             console.log(refreshTokens)
             response.send("logout success")
        } catch (error) {
            console.log(error)
            return helper.response(response, 500, error)
        }
     },
}