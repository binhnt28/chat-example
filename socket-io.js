const { Server } = require('socket.io');
let io;
let userSockets = [];
let userInRoom = [];
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
            if (userInRoom[room]) {
                userInRoom[room].push(socket.id);
            } else {
                userInRoom[room] = [socket.id];
            }
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

        socket.on('sendMessage', (data) => {
           socket.broadcast.to(data.roomId).emit('newMessage', data.data.message);
        })

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
            if (currentRoom) {
                socket.leave(currentRoom);
                delete userInRoom[currentRoom][socket.id];
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
    userSockets,
    userInRoom,
}
