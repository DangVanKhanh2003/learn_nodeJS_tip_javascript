'use strict'

const _SECONDS =5000;
const mongoose = require('mongoose')
const os = require('os')
// count connect
const countConnect = () =>{
    const numConnection = mongoose.connections.length
    console.log(`Number of connection: ${numConnection}`)
}



//check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)
        console.log(`Active connections: $`)
        // exemple maximum number of connection based on number of cores
        const maxConnections = numCores * 5;// exempler each core can load 5 connection
        if(numConnection > maxConnections){
            console.log(`Connection overload detected!`)
        }
    }, _SECONDS)// Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}