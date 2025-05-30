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