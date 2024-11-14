const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema(
    {
        user_name : {
            type : String
        },
        email : {
            type : String
        },
        password : {
            type : String
        },
        user_slug : {
            type : String
        },
        role : {
            type : String
        },
        user_permission : {
            type : Array,
            default : []
        },
        user_status : {
            type : Boolean,
            default : false
        },
        user_verification_token : {
            type : String
        },
        user_activated_status : {
            type : Boolean,
            default : false
        },
        createdAt : {
            type : Date,
            default : new Date()
        },
        upadatedAt : {
            type : Date,
            default : new Date()
        },
        sidebar_toggle: {
            type : Boolean,
            default : false
        },
        custom_theme : {
            type : Array,
            default : null
        }
    },
    {
        collection : 'user'
    }
)

module.exports = mongoose.model('User', User);