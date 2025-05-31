'use strict'

const JWT = require('jsonwebtoken')
const createTokenPair = async(payload, privateKey) =>{
    try{
        // access token
        const accessToken = await JWT.sign(payload, privateKey, {
            expiresIn: '2 days'
        })
        const refeshToken = await JWT.sign(payload, privateKey, {
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