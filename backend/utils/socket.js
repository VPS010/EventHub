const socketio = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketio(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["my-custom-header"],
        },
        allowEIO3: true,
        transport: ['polling', 'websocket']
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('join_event', (eventId) => {
            socket.join(eventId);
            console.log(`Socket ${socket.id} joined event ${eventId}`);
        });

        socket.on('join_event', (eventId) => {
            socket.join(eventId);
        });

        socket.on('leave_event', (eventId) => {
            socket.leave(eventId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initSocket, getIO };