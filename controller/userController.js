const User = require('../model/user');

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