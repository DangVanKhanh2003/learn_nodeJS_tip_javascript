'use strict'

const { token } = require("morgan")
const keytokenModel = require("../model/keytoken.model")

class  keyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey}) =>{

        try{
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKey,
                privateKey: privateKey
            })
            
            return tokens ? tokens.publicKey : null
        }
        catch(error){
            return error
        }
    }
}

module.exports = keyTokenService