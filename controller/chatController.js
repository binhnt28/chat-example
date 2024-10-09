const User = require('../model/user')
const Message = require('../model/message')
const MessageDetail = require('../model/messageDetail')
const { sendSuccess, sendError } = require('../helper/responseHelper');
const { getIoInstanse } = require('../socket-io');
const CreateMessageSchema = require('../validator/ChatValidator');
const mongoose = require("mongoose");
exports.listMessage = async (req, res) => {
    // const groupId = await
    let messages = await Message.find({
        user_join: req.user._id
    }).populate({
        path: 'user_join',
        match: {_id: {$ne : req.user._id}},
        select: '-password'
    }).populate({
        path: 'last_message',
        populate: {
            path: 'sender',
            select: '-password'
        }
    });

    message = messages.map((item) => {
        const objMessage = item.toObject();
        objMessage.info = objMessage.user_join;
        delete objMessage.user_join;
        return objMessage;
    })

    sendSuccess(res, message);
}

exports.sendMessage = async (req, res) => {
    try {

        let data = req.body;
        data.sender = req.user._id;
        await CreateMessageSchema.validateAsync(data);
        const receive = await User.findById(data.receiveId);
        const sender = await User.findById(data.sender);

        if (!receive) {
            return sendError(res,[], 'Receive not found', 404);
        }

        let message = await Message.findOne({
            user_join: {
                $all: [req.user._id, data.receiveId]
            }
        });

        if (!message) {
            message = new Message({
                user_join: [req.user._id, data.receiveId]
            });
            await message.save();
        }

        const detail = new MessageDetail({
            message_id: message._id,
            sender: data.sender,
            message: data.message
        })

        await detail.save();
        message.last_message = detail._id;
        await message.save();
        message = message.toObject();
        detail.sender = sender; 
        message.last_message = detail;
        message.info = [sender];
        const data_response = {
            message: message
        }
        const io = getIoInstanse();
        socket.to(message._id.toString()).emit('newMessage', message);
        sendSuccess(res, data_response);
    }
    catch (err) {
        if (err.isJoi) {
            return sendError(res, [], err.details[0].message, 400)
        }
        console.log(err);
        sendError(res, [], 'Server error', 500)
    }
}

exports.detailMessage = async (req, res) => {
    const messageId = req.params.id || ''
    if (messageId == '') return sendSuccess(res);
    let message = await Message.findById(messageId).populate({
        path: 'user_join',
        match: {_id: {$ne : req.user._id}},
        select: '-password'
    });
    if (message) {
        const messages = await MessageDetail.find({
          message_id: messageId
        }).populate('sender').sort({created_at: 1});
        message = message.toObject();
        message.info = message.group_id == null ? message.user_join : 'group';
        delete message.user_join;
        return sendSuccess(res,{message, messages})
    }
    sendError(res);
}

exports.createGroup = async (req, res) => {

}