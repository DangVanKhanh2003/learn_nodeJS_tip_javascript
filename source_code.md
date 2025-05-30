# Source Code Summary

## Directory Structure
```
./
  .gitignore
  package-lock.json
  package.json
  server.js
  src/
    .env
    app.js
    configs/
      config.mongodb.js
    controller/
      access.controller.js
    dbs/
      init.mongodb.js
      init.mongodb.lv0.js
    helpers/
      check.connect.js
    model/
      shop.model.js
    postman/
      access.post.http
    routes/
      index.js
      access/
        index.js
    service/
    utils/
```


## File Contents


### server.js

```js
//chỉ dùng để configs routers

const app = require('./src/app');

const PORT = 3055;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit server Express`));
});

```

---


### src\app.js

```js
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

// init db
require('./dbs/init.mongodb')
checkOverload()
// init routes
app.use('', require('./routes'))
// handling error


module.exports = app
```

---


### src\configs\config.mongodb.js

```js
'use strict'

//level 0

// const config = {
//     app:{
//         port: 3000
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: 'db'
//     }
// }


//level 1



const dev = {
    app:{
        port: process.env.DEV_APP_PORT || 3200
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27010,
        name: process.env.DEV_DB_NAME || 'shopDEV'
    }
}

const pro = {
    app:{
        port: process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: process.env.PRO_APP_HOST || 'localhost',
        port: process.env.PRO_APP_PORT || 27017,
        name: process.env.PRO_APP_NAME || 'shopPRO'
    }
}

const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]

```

---


### src\controller\access.controller.js

```js
'use strict'

class AccessController{
    signUp = async (req, res, next) => {
        try{
                /// 200 OK
                /// 2001  CREATE
            console.log(`[P]::signUp::`, req.body)
            return res.status(200).json({
                code: '2001',
                metadata: {userid: 1}

            })
        }
        catch(error){
            next(error)
        }
    }
}

module.exports = new AccessController()
```

---


### src\dbs\init.mongodb.js

```js
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
```

---


### src\dbs\init.mongodb.lv0.js

```js
'use strict'

const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/shopDEV'
mongoose.connect(connectString).then(_ => console.log(`Connect Mongodb Success`
)).catch(err => console.log(`Error Connect`))

module.exports = mongoose
```

---


### src\helpers\check.connect.js

```js
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
```

---


### src\model\shop.model.js

```js
'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    email:{
        type:String,
        trim: true,
        unique:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    password:{
        type:String,
        required:true,
    },
    verfity: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles:{
        type: Array,
        default: []
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, COLLECTION_NAME);
```

---


### src\routes\index.js

```js
'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api/', require('./access'))
// router.get('/', (req, res, next) => {
//     return res.status(200).json({
//         message: 'welcome FantipJS',
//     })
// })

module.exports = router
```

---


### src\routes\access\index.js

```js
'use strict'

const express = require('express')
const accessController = require('../../controller/access.controller')
const router = express.Router()

//signUp
router.post('shop/signup', accessController.signUp)

module.exports = router
```

---
