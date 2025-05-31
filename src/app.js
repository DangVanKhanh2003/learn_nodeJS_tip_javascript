require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
const { checkOverload } = require('./helpers/check.connect')

const app = express()

// init middlewarees

// morgan giúp show thông báo log trên terminal tùy theo mode
app.use(morgan('dev')) // trạng thái log code được tô màu dễ cho dev phát triển
//app.use(morgan('combined')) // trạng thái khi chạy product thì nên dùng khi chạy mode này
// app.use(morgan('common'))
// app.use(morgan('short'))
// app.use(morgan('tiny'))

app.use(helmet())// bảo vệ không cho hacker đọc tông tin quan trọng curl.ext http://localhost:3055 --include

app.use(compression()) // giúp giảm tải dữ liệu khi fetch API
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// init db
require('./dbs/init.mongodb')
checkOverload()

// init routes
app.use('', require('./routes'))

// handling error
app.use((req, res, next) =>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) =>{
  
    const status = error.status || 500
    return res.status().json({
        status: 'error',
        code: status,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app