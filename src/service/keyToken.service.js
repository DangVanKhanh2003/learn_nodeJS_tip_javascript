'use strict'

const { token } = require("morgan")
const keytokenModel = require("../model/keytoken.model")
const { filter } = require("lodash")

class  keyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) =>{

        try{
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })
            
            // return tokens ? tokens.publicKey : null
            const filter = {user: userId}, update = { 
                publicKey, privateKey, refreshTokensUser: [], refreshToken
            }, options = {upsert: true, new: true}

            console.log("khanhs depj dai1: " + refreshToken)
            
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        }
        catch(error){
            return error
        }
    }
}

module.exports = keyTokenService