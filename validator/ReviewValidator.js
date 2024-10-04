const Joi = require('joi');
const validateReviewer = async (value, helpers) => {
    const {reviewer, product} = value;
    if (!reviewer || !product) {
        return helpers.message('Sản phẩm không hợp lệ !')
    }
    return value;
}

const reviewSchema = Joi.object({
    productId: Joi.required(),
    reviewer: Joi.string().required(),
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().required(),
    product: Joi.object().messages({
        'object.base': 'Product not found'
    }),
}).external(validateReviewer);

module.exports = reviewSchema;