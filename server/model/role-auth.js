const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleAuth = Schema(
    {
        role_slug : {
            type : String
        }, 
        sub_module : {
            type : Array,
            default : []
        },
        status : {
            type : Boolean
        },
        createdAt: {
            type: Date,
            default : new Date()
        },
        upadatedAt: {
            type: Date,
            default : new Date()
        }
    },
    {
        collection: 'role-auth'
    }
)

module.exports = mongoose.model('RoleAuth', RoleAuth);