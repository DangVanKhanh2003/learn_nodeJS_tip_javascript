# Source Code Summary

## Directory Structure
```
./
  .gitignore
  package-lock.json
  package.json
  server.js
  source_code.md
  src/
    .env
    app.js
    auth/
      authUtils.js
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
      keytoken.model.js
      shop.model.js
    postman/
    routes/
      index.js
      access/
        index.js
    service/
      access.service.js
      keyToken.service.js
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


module.exports = app
```

---


### src\auth\authUtils.js

```js
'use strict'

const JWT = require('jsonwebtoken')
const createTokenPair = async(payload, privateKey) =>{
    try{
        // access token
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
        const refeshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
        return {accessToken, refeshToken}
    }
    catch(error)
    {

    }
}

module.exports = {
    createTokenPair
}
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
const AccessService = require("../service/access.service")
class AccessController{
    signUp = async (req, res, next) => {
        try{
                /// 200 OK
                /// 2001  CREATE
            console.log(`[P]::signUp::`, req.body)
            return res.status(200).json(await AccessService.signUp(req.body))
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


### src\model\keytoken.model.js

```js
'use strict'

const {Schema, model, Collection} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    refeshToken:{
        type: Array,
        default: []
    },
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
    
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
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
module.exports = model(DOCUMENT_NAME, shopSchema);
```

---


### src\routes\index.js

```js
'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access'))
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
router.post('/shop/signup', accessController.signUp)

module.exports = router
```

---


### src\service\access.service.js

```js
'use strict'

const shopModel = require("../model/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService{
    static signUp = async () => {
        try 
        {
            //step1: check email exists??
            const hoderShop = await shopModel.findOne({email}).lean()
            if(hoderShop)
            {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }
            const passwordHash =  await bycrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){
                //create private key and public key
                const{privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
                
                console.log({privateKey, publicKey}) //save collection key store

                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if(!publicKeyString)
                {
                    return {
                        code: 'xxx',
                        message: 'public key string error!'
                    }
                }
                
                const tokens = await createTokenPair({userId: newShop._id, email}, privateKey)
                console.log("Create Token Success:: ", tokens)
                return {
                    code: 201,
                    metadata:{
                        shop: newShop,
                        tokens
                    }
                }
            }

            return {
                code: 200, 
                metadata: null
            }
        }
        catch (error)
        {
            return {
                code: 'xxx',
                message:error.message,
                status: 'error'
            }
        }
    }

}

moudule.exports = AccessSErvice
```

---


### src\service\keyToken.service.js

```js
'use strict'

const keytokenModel = require("../model/keytoken.model")

class  keyTokenService{
    static createKeyToken = async ({user, publicKey}) =>{
        try{
            const publicKeyString = publicKey.toString()
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })
            
            return tokens ? publicKeyString : null
        }
        catch(error){
            return error
        }
    }
}

module.exports = KeyboardEvent
```

---
