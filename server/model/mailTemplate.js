const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailTemplate = new Schema(
    {
        template_name : {
            type : String
        },       
        subject : {
            type : String
        },
        description : {
            type : String
        },
        slug : {
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
        collection: 'mail-template'
    }
)

module.exports = mongoose.model('MailTemplate', MailTemplate);
