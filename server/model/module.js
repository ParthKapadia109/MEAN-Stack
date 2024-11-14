const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Module = new Schema(
    {
        title : {
            type : String
        },       
        module_slug : {
            type : String
        },
        sub_module : [{
            sub_module_title : {
                type : String
            },
            sub_module_slug : {
                type : String
            }
        }],
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
        collection: 'module'
    }
)

module.exports = mongoose.model('Module', Module);
