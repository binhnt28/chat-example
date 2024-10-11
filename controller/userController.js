const User = require('../model/user');
const {sendSuccess} = require("../helper/responseHelper");

exports.searchUser = async (req, res) => {
    const query = req.query.query;
    const user = await User.find({
        $or: [
            {email: { $regex: query, $options: 'i'}},
            {name: { $regex: query, $options: 'i'} }
        ]
    });
    res.status(200).json(user);
}

exports.listUser = async (req, res) => {
    const user = await User.find({
        _id: {$ne: req.user._id}
    })
    sendSuccess(res, user);
}

