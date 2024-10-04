const express = require('express');
const { createServer } = require('http');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/apiRoutes'); // Import routes
const { Server } = require('socket.io');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors: {
        origin: 'http://localhost:5173', // Địa chỉ frontend của bạn
        methods: ['GET', 'POST'], // Các phương thức được phép
        // credentials: true // Nếu cần sử dụng cookie hoặc thông tin xác thực
    },});
io.on("connection", (socket) => {
    console.log('connected');
});
setInterval(() => {
    io.emit('test', `${new Date()}`);
}, 1000);
const port = 3000;
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongoexample', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));
// Middleware JSON
app.use(express.json());
// Use routes
app.use('/api', apiRoutes);

httpServer.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});