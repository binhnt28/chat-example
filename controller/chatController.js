const User = require('../model/user')
const Message = require('../model/message')
const MessageDetail = require('../model/messageDetail')
const { sendSuccess, sendError } = require('../helper/responseHelper');
const { getIoInstanse, userSockets, userInRoom } = require('../socket-io');
const CreateMessageSchema = require('../validator/ChatValidator');
const Group = require('../model/group');

exports.listMessage = async (req, res) => {
    const groupIds = await Group.find({
        member: {
            $all: [req.user._id]
        }
    }).select('_id');
    const groupIdsArray = groupIds.map(group => group._id);
    let messages = await Message.find({
        $or: [
            {user_join: req.user._id},
            {group_id: {$in: groupIdsArray}}
        ]
    }).populate({
        path: 'user_join',
        match: {_id: {$ne : req.user._id}},
        select: '-password'
    }).populate('group_id')
    .populate({
        path: 'last_message',
        populate: {
            path: 'sender',
            select: '-password'
        }
    }).sort({'updated_at': -1});

    message = messages.map((item) => {
        const objMessage = item.toObject();
        objMessage.info = objMessage.group_id === null ? objMessage.user_join : [objMessage.group_id];
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
        let receive = await User.findById(data.receiveId);
        let isGroup = false;

        const sender = await User.findById(data.sender);

        if (!receive) {
            receive = await Group.findById(data.receiveId);
            isGroup = true;
            if (!receive)
            return sendError(res,[], 'Receive not found', 404);
        }
        let message;
        if (isGroup) {
            message = await Message.findOne({
                group_id: data.receiveId
            });
        } else {
            message = await Message.findOne({
                user_join: {
                    $all: [req.user._id, data.receiveId]
                }
            });
        }
        

        if (!message) {
            message = new Message({
                user_join: [req.user._id, data.receiveId]
            });
            await message.save();
        }

        const detail = new MessageDetail({
            message_id: message._id,
            sender: data.sender,
            message: data.message,
            created_at: Date.now()
        })

        await detail.save();
        message.last_message = detail._id;
        message.updated_at = Date.now();
        await message.save();
        message = message.toObject();
        detail.sender = sender;
        message.last_message = detail;
        message.info = isGroup ? [receive] : [sender];
        if (message.group_id === null && data.receiveId && userSockets && userSockets[data.receiveId]) {
            const io = getIoInstanse();
            if (!userInRoom[message._id]) {
                io.to(userSockets[data.receiveId]).emit('ListNewMessage', message);
            } else {
                const socketInRoom = userInRoom[message._id].findIndex((item) => item == userSockets[data.receiveId]) || -1;
                if (socketInRoom === -1) {
                    io.to(userSockets[data.receiveId]).emit('ListNewMessage', message);
                }
            } 
        } else if (message.group_id !== null) {
            receive.member.forEach((item) => {
                if (item._id && item._id.toString() != req.user._id && userSockets && userSockets[item._id.toString()]) {
                    const io = getIoInstanse();
                    io.to(userSockets[item._id.toString()]).emit('ListNewMessage', message);
                }
            })
        }
        message.info = [receive];
        const data_response = {
            message: message
        }
        sendSuccess(res, data_response);
    }
    catch (err) {
        if (err.isJoi) {
            return sendError(res, [], err.details[0].message, 400)
        }
        console.log(err);
        sendError(res, [], err, 500)
    }
}

exports.detailMessage = async (req, res) => {
    const messageId = req.params.id || ''
    if (messageId == '') return sendSuccess(res);
    let message = await Message.findById(messageId).populate({
        path: 'user_join',
        match: {_id: {$ne : req.user._id}},
        select: '-password'
    }).populate('group_id');
    if (message) {
        const messages = await MessageDetail.find({
          message_id: messageId
        }).populate('sender').sort({created_at: 1});
        message = message.toObject();
        message.info = message.group_id == null ? message.user_join : [message.group_id];
        delete message.user_join;
        return sendSuccess(res,{message, messages})
    }
    sendError(res);
}

exports.createGroup = async (req, res) => {
    try {
        let data = req.body;
        data.member.push(req.user._id);
        const group = new Group({
            name: data.name,
            member: data.member,
            key_member: req.user._id
        });
        const sender = await User.findById(data.sender);
        await group.save();
        message = new Message({
            group_id: group._id,
        });
        
        const detail = new MessageDetail({
            message_id: message._id,
            sender: req.user._id,
            message: data.message,
            created_at: Date.now()
        })
    
        await detail.save();
        message.last_message = detail._id;
        await message.save();
        message = message.toObject();
        detail.sender = sender;
        message.last_message = detail;
        message.info = [group];
        
        group.member.forEach((item) => {
            if (item._id && userSockets && userSockets[item._id]) {
                const io = getIoInstanse();
                io.to(userSockets[item._id]).emit('ListNewMessage', message);
            }
        })

        const data_response = {
            message: message
        }
        sendSuccess(res, data_response);
    } catch (err) {
        console.log(err)
    }
}

