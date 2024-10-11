const Joi = require("joi");

const CreateMessageSchema = Joi.object({
    receiveId: Joi.string().required(),
    sender: Joi.string().required(),
    message: Joi.required(),
})

module.exports = CreateMessageSchema;