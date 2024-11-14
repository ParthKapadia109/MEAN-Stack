const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema(
    {
        role_name: {
            type: String
        },
        role_slug: {
            type: String
        },
        role_status: {
            type: Boolean
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
        collection: 'role'
    }
);

module.exports = mongoose.model('Role', Role);