document.getElementById('create-room-btn').addEventListener('click', () => {
    fetch('/create-room')
        .then(response => response.json())
        .then(data => {
            const roomLink = `${window.location.origin}${data.roomId}`;
            document.getElementById('room-link').textContent = roomLink;

            const copyButton = document.getElementById('copy-link-btn');
            const joinButton = document.getElementById('join-room-btn');
            copyButton.style.display = 'inline';
            joinButton.style.display = 'inline';

            // Copy link to clipboard
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(roomLink);
                alert('Room link copied to clipboard!');
            });

            // Join the room
            joinButton.addEventListener('click', () => {
                window.location.href = roomLink;
            });
        });
});
