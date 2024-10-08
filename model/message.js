const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
        default: null,
    },
    user_join: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    last_message: {
        type: mongoose.Schema.ObjectId,
        ref: 'MessageDetail'
    },
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Message', MessageSchema);