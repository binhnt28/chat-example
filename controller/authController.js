const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const [RegisterValidator, LoginValidator] = require('../validator/AuthValidator');
const {sendSuccess, sendError} = require('../helper/responseHelper');
exports.register = async  (req, res) => {
    try {
    
        await RegisterValidator.validateAsync(req.body);
        const data = req.body;
        const user = {
            name: data.name,
            email: data.email,
            username: data.username,
            password: await bcrypt.hash(data.password, 10)
        }
        const newUser = new User(user);
        await newUser.save();
        sendSuccess(res);
    } catch (err) {
        sendError(res,{}, err.isJoi ? err.details[0].message : 'Server error', 500)
    }
}

exports.login = async (req, res) => {
    try {
        await LoginValidator.validateAsync(req.body);
        const data = req.body;
        const user = await User.findOne({username: data.username});
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatchPassword = await bcrypt.compare(data.password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign({_id: user._id, username: user.username}, JWT_SECRET, {
            expiresIn: '1h'
        })
        sendSuccess(res, {token: token, _id: user._id}, 'Login successful');
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        sendError(res,{}, 'Server error !');
    }
}
