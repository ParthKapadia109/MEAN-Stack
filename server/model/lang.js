const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lang = new Schema(
    {
        uid: {
            type : String
        },
        value : {
            type : String
        },
        is_selected : {
            type : String
        }, 
        status : {
            type : Boolean
        },
        createdAt : {
            type : Date,
            default : new Date()
        },
        upadatedAt : {
            type : Date,
            default : new Date()
        }
    },
    {
        collection: 'language'
    }
)

module.exports = mongoose.model('Language', Lang);
