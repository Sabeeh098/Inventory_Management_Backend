const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name : {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
    },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
