'use strict'

const {Schema, model, Collection, default: mongoose} = require('mongoose'); // Erase if already required

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
    privateKey:{
        type:String,
        required:true,
    },
    refeshTokensUsed:{
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true,
    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
    
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);