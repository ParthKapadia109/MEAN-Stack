const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailSetting = new Schema(
    {
        service : {
            type : String
        },       
        host : {
            type : String
        },
        port : {
            type : String
        },
        secure : {
            type : Boolean
        },
        email : {
            type : String
        },
        password: {
            type : String
        },
        mail_slug: {
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
        collection: 'mail-setting'
    }
)

module.exports = mongoose.model('MailSetting', MailSetting);
