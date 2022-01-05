const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    'username': String,
    'email': String,
    'created_at': Date
});

module.exports = mongoose.model('User', userSchema);