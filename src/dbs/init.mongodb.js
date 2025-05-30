// sington parten for connect DB

'use strict'
const mongoose = require('mongoose')
const {db: {host, name, port}} = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
const {countConnect} = require('../helpers/check.connect')

console.log("Connect string: " + connectString)

class Database{
    constructor(){
        this.connect()
    }

    connect(){
        if(1 === 1)
        {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }


        mongoose.connect(connectString,
            {
                maxPoolSize: 50// chỉ tối đa 50 connect đến db nếu nhiều connect quá thì phải chờ pool rảnh mới được vào
            }
        ).then(_ => console.log(`Connect Mongodb Success`, countConnect()
        )).catch(err => console.log(`Error Connect`))
    }

    static getInstance()
    {
        if(!Database.instance)
        {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb