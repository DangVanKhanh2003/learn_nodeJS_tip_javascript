'use strict'
const AccessService = require("../service/access.service")
class AccessController{
    signUp = async (req, res, next) => {
        /// 200 OK
        /// 2001  CREATE
        console.log(`[P]::signUp::`, req.body)
        return res.status(200).json(await AccessService.signUp(req.body))

    }
}

module.exports = new AccessController()