const mongoose = require('mongoose');
const MessageDetailSchema = new mongoose.Schema({
    message_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Message'
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    message: {
        type: String,
        default: null,
    },

    is_read: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],

    created_at: {
        type: Date,
        default: Date.now(),
    }
})
module.exports = mongoose.model('MessageDetail', MessageDetailSchema);