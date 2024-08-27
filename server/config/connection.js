const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env?.HOST,
    password: process.env?.PASSWORD,
    user: process.env?.USER,
    database: process.env?.DATABASE
})
connection.connect((err)=> {
    if(err){
        throw err;
    }else{
        console.log('connected to db')
    }
})

module.exports = connection