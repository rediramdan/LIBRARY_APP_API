const connection = require('../config/mysql')

module.exports = {
    getAllData: function(table){
        return new Promise(function(resolve, reject){
            connection.query('SELECT * FROM '+table, function(error, result){
                if(!error){
                    resolve(result)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    getAllDataJoin: function(table,where,select){
        return new Promise(function(resolve, reject){
            connection
                .query('SELECT '+select+' FROM '+table+' '+where, function(error, result){
                if(!error){
                    resolve(result)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    getDataById: function(select,table,id){
        return new Promise(function(resolve, reject){
            connection.query('SELECT '+select+' FROM '+table+' WHERE id = ?',id, function(error, result){
                if(!error){
                    const newData = result[0]
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    getIdById: function(table,id){
        return new Promise(function(resolve, reject){
            connection.query('SELECT id FROM '+table+' WHERE id = ?',id, function(error, result){
                if(!error){
                    const newData = result[0]
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    getDataByIdCustom: function(select,table,where){
        return new Promise(function(resolve, reject){
            connection.query('SELECT '+select+' FROM '+table+' WHERE '+where, function(error, result){
                if(!error){
                    resolve(result)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    getDataAmount: function(table){
        return new Promise(function(resolve, reject){
            connection.query('SELECT COUNT(id) as amount FROM '+table, function(error, result){
                if(!error){
                    resolve(result[0])
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    postData: function(table,setData){
        return new Promise(function(resolve, reject){
            connection.query('INSERT INTO '+table+' SET ?',setData,function(error, result){
                if(!error){
                    const newData = {
                        id : result.insertId,
                        ...setData
                    }
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    putData: function(table,setData,id){
        return new Promise(function(resolve, reject){
            connection.query('UPDATE '+table+' SET ? WHERE id=?',[setData,id],function(error, result){
                if(!error){
                    const newData = {
                        id : id,
                        ...setData,
                        affectedRows : result.affectedRows,
                        changedRows : result.changedRows,
                    }
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    deleteData: function(table,id){
        return new Promise(function(resolve, reject){
            connection.query('DELETE FROM '+table+' WHERE id=?',id,function(error, result){
                if(!error){
                    const newData = {
                        id : id,
                        affectedRows : result.affectedRows,
                        changedRows : result.changedRows,

                    }
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    },
    deleteDataCustom: function(table,id){
        return new Promise(function(resolve, reject){
            connection.query('DELETE FROM '+table+' WHERE '+id,function(error, result){
                if(!error){
                    const newData = {
                        id : id
                    }
                    resolve(newData)
                }else{
                    reject(new Error(error))
                }
            })
        })
    }
}