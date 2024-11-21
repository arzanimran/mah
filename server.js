const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the HTML file directly
});

let users = []; // Store users that are currently connected

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('user join', (username) => {
        if (!users.includes(username)) {
            users.push(username);
        }
        io.emit('user join', users); // Emit the updated user list to everyone
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Emit the chat message to everyone
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        users = users.filter(user => user !== socket.username);
        io.emit('user leave', users); // Emit the updated user list to everyone
    });
});


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});