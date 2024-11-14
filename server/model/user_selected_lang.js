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
        collection: 'user_selected_language'
    }
)

module.exports = mongoose.model('UserSelectedLanguage', Lang);
