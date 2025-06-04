'use strict'

const shopModel = require("../model/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getIntoData } = require("../utils")
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

const {findByEmail} = require('./shop.service')
class AccessService{

    static login = async({email, password, refreshToken = null}) =>{
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not registered')

        const match = bycrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const {_id: userId} = foundShop._id
        const tokens = await createTokenPair({userId: userId, email}, privateKey)

        await keyTokenService.createKeyToken({
            userId,
            privateKey,
            publicKey,
            refreshToken: tokens.refeshToken,
        })
        return {
            shop: getIntoData({fileds: ["_id", "name", "email"], object: foundShop}),
            tokens
        }
    }


    static signUp = async ({name, email, password}) => {
        try 
        {
            console.log(email)
            //step1: check email exists??
            const hoderShop = await shopModel.findOne({email}).lean()
            if(hoderShop)
            {
                throw new BadRequestError('Error: Shop already registered!')
            }
            const passwordHash =  await bycrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){


                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                
                console.log({privateKey, publicKey}) //save collection key store

                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                console.log("khanh111: " + keyStore)
                if(!keyStore)
                {
                    throw new BadRequestError('public key string error!')
                }
                
                const tokens = await createTokenPair({userId: newShop._id, email}, privateKey)

                console.log("Create Token Success: ", tokens)
                return {
                    code: 201,
                    metadata:{
                        shop: getIntoData({fileds: ["_id", "name", "email"], object: newShop}),
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
            throw error
        }
    }

}

module.exports = AccessService