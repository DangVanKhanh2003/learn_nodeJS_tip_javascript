'use strict'

const shopModel = require("../model/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessSErvice{
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