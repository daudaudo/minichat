const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    'content': {
        type: String,
        text: true,
        required: true,
    },
    'like': {
        type: mongoose.SchemaTypes.Map,
        of: {
            type: mongoose.SchemaTypes.ObjectId,
        },
        default: {},
    },
    'owner': {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    'comment':{
        type: mongoose.SchemaTypes.Map,
        of: {
            type: mongoose.SchemaTypes.ObjectId,
            ref:'Comment',
        },
        default: {},
    },
    'deleted_at' : {
        type: mongoose.SchemaTypes.Date,
        default: null,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
module.exports = mongoose.model('Post', postSchema);
