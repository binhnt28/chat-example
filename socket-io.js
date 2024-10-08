const { Server } = require('socket.io');
let io;

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5174',
            methods: ['GET', 'POST'],
        }
    });
    io.on("connection", (socket) => {
        socket.on('joinRoom', (room) => {
            socket.join(room);  // Tham gia room
            console.log(`User ${socket.id} joined room: ${room}`);
        });
    
        console.log('User connected', socket.id);
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });
   

    return io;
};

const getIoInstanse = () => {
    if (!io) {
        throw new Error('Socket-io not init');
    }
    return io;
}
module.exports = {
    initializeSocket,
    getIoInstanse,
}