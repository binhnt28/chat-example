
const Category = require('../model/category');
const mongoose = require('mongoose');
const Joi = require('joi');
const validateCategoryId = async (value, helpers) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('CategoryId not correct');
        }
        const categoryExist = await Category.findById(value);
        if (!categoryExist) {
            return helpers.message('Category not found');
        }
        return value;
    } catch (error) {
        console.error('Error while checking category:', error);
        return helpers.message('Err server');
    }
};

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    categoryId: Joi.string().external(validateCategoryId)
})
module.exports = productSchema;