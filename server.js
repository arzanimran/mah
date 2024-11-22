const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
/*const io = new Server(server);*/
const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let users = [];

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('user join', (username) => {
        socket.username = username;
        users.push(username);
        io.emit('chat message', { username: 'System', type: 'text', content: `${username} joined the chat.` });
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user !== socket.username);
        io.emit('chat message', { username: 'System', type: 'text', content: `${socket.username} left the chat.` });
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
