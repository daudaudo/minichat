const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    'username': {
        type: String,
        index: true,
        required: true,
    },
    'email': {
        type: String,
        required: true,
    },
    'created_at': {
        type: Date,
    }
});

module.exports = mongoose.model('User', userSchema);