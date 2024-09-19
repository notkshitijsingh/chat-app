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
    // Random name and avatar assignment
    const names = fs.readFileSync('names.txt', 'utf-8').split('\n');
    const avatars = fs.readdirSync(path.join(__dirname, '..', 'assets', 'avatars'));

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    // Emit user info with the correct avatar path
    socket.emit('user-info', { name: randomName, avatar: `/assets/avatars/${randomAvatar}` });

    // Handle chat messages
    socket.on('chat-message', (message) => {
        io.emit('chat-message', message);
    });

    // Handle image upload
    socket.on('image-upload', (imageData) => {
        io.emit('image-upload', imageData);
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
