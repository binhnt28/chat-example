const jwt = require('jsonwebtoken');
exports.verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }
    try {
        const decoded  = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không tồn tại' });
    }
}