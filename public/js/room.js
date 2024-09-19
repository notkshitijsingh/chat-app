const socket = io();
let currentUser = '';

// Display user info (name and avatar)
socket.on('user-info', ({ name, avatar }) => {
    currentUser = name;
    document.getElementById('username').textContent = name;
    document.getElementById('avatar').src = avatar;
});

// Send message
document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message) {
        socket.emit('chat-message', { user: currentUser, message });
        document.getElementById('message-input').value = '';
    }
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
