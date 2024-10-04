const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    review: [
        {
            _id: {
                type: mongoose.Schema.ObjectId,
                auto: true,
            },
            reviewer: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            comment: {
                type: String,
                required: true
            },
            created_at: {
                type: Date,
                default: Date.now()
            }
        }
    ]
})

module.exports = mongoose.model('Product', productSchema)