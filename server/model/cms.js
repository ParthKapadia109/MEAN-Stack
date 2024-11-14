const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CMS = new Schema(
    {
        title : {
            type : String
        },       
        hading : {
            type : String
        },
        description : {
            type : String
        },
        slug : {
            type : String
        },
        header : {
            type : Boolean
        },
        footer : {
            type : Boolean
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
        collection: 'cms'
    }
)

module.exports = mongoose.model('CMS', CMS);
