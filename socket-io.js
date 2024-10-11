const { Server } = require('socket.io');
let io;
let userSockets = [];
const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });
    io.on("connection", (socket) => {
        let currentRoom = '';
        socket.on('joinRoom', (room) => {
            currentRoom = room
            socket.join(room);
            console.log('User joined room:', room);
        });

        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log('User left room:', room);
        });

        socket.on('registerUser', (userId) => {
            userSockets[userId] = socket.id;
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });

        socket.on('newMessage', (data) => {
           console.log(data.roomId);
           socket.broadcast.to(data.roomId).emit('Message1', []);
        })

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
            if (currentRoom) {
                socket.leave(currentRoom);
                console.log(`User left room ${currentRoom} when disconnected:`, socket.id);
            }
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
    userSockets
}
