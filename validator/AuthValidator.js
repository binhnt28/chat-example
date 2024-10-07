const User = require('../model/user');
const mongoose = require('mongoose');
const Joi = require('joi');
const validateUserUnique = async (value, helpers) => {
    try {
        const {username, email } = value;
        const userExist = await User.findOne({$or: [{username}, {email}]});
        if (userExist) {
            return helpers.message('User exist !');
        }
        return value;
    } catch (error) {
        return helpers.message('Err server');
    }
}
const RegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
}).external(validateUserUnique);

const LoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

module.exports = [RegisterSchema, LoginSchema];