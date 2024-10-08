const socket = io();

// Get the roomId from the URL
const roomId = window.location.pathname.split('/')[2];

// Join the specific room
socket.emit('join-room', roomId);

let currentUser = '';

// Display user info (name and avatar)
socket.on('user-info', ({ name, avatar }) => {
    currentUser = name;
    document.getElementById('username').textContent = name;
    document.getElementById('avatar').src = avatar;
    socket.emit('notify-enter', { name: name });
});

// Send message with Send button
document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message) {
        socket.emit('chat-message', { user: currentUser, message });
        document.getElementById('message-input').value = '';
    }
});

// Send message with Enter key
document.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        const message = document.getElementById('message-input').value;
        if (message) {
            socket.emit('chat-message', { user: currentUser, message });
            document.getElementById('message-input').value = '';
        }
    };
});

// Notify when someone enters the chat
socket.on('notify-enter', (data) => {
    // Giving the user a message when someone joins
    console.log(`${data.name} has entered the chat.`);
    const chatBox = document.getElementById('chat-box');
    const messageElem = document.createElement('div');
    messageElem.classList.add('message-system');
    messageElem.classList.add('entered-notification');
    messageElem.textContent = `${data.name} has entered the chat.`;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Receive messages
socket.on('chat-message', (data) => {
    const chatBox = document.getElementById('chat-box');
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');

    // Check if the message is from the current user or someone else
    if (data.user === currentUser) {
        messageElem.classList.add('message-right');
    } else {
        messageElem.classList.add('message-left');
    }

    messageElem.textContent = `${data.message}`;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Send image
document.getElementById('image-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            socket.emit('image-upload', { user: currentUser, image: reader.result });
        };
        reader.readAsDataURL(file);
    }
});

// Receive image
socket.on('image-upload', (data) => {
    const chatBox = document.getElementById('chat-box');
    const imgElem = document.createElement('img');
    imgElem.src = data.image;
    imgElem.style.maxWidth = '100%';

    const messageElem = document.createElement('div');
    messageElem.classList.add('message');

    // Check if the image is from the current user or someone else
    if (data.user === currentUser) {
        messageElem.classList.add('message-right');
    } else {
        messageElem.classList.add('message-left');
    }

    messageElem.appendChild(imgElem);
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
});
