const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from /public
app.use(express.static('public'));

// Serve avatars from /assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Generate random room ID
app.get('/create-room', (req, res) => {
    const roomId = Math.random().toString(36).substring(7);
    res.send({ roomId: `/chatroom/${roomId}` });
});

// Serve room page
app.get('/chatroom/:roomId', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'room.html'));
});

// WebSocket logic
io.on('connection', (socket) => {
    // Join room based on roomId passed from the client
    socket.on('join-room', (roomId) => {
        socket.join(roomId);

        // Random name and avatar assignment
        const names = fs.readFileSync('names.txt', 'utf-8').split('\n');
        const avatars = fs.readdirSync(path.join(__dirname, '..', 'assets', 'avatars'));

        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

        // Emit user info to the current client
        socket.emit('user-info', { name: randomName, avatar: `/assets/avatars/${randomAvatar}` });

        // Notify all users in the room that someone has joined
        socket.to(roomId).emit('notify-enter', { name: randomName });

        // Handle chat messages in a specific room
        socket.on('chat-message', (message) => {
            io.to(roomId).emit('chat-message', message);
        });

        // Handle image uploads in a specific room
        socket.on('image-upload', (imageData) => {
            io.to(roomId).emit('image-upload', imageData);
        });
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
