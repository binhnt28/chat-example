const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    key_member: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    member: [
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

module.exports = mongoose.model('Group', GroupSchema);