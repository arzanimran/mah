
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Unified CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5000', // Your client's URL
    methods: ["GET", "POST"]
};

const io = new Server(server, {
    cors: corsOptions
});

// Apply CORS middleware to the Express app
app.use(cors(corsOptions));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat application logic
let users = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining
    socket.on('user join', (username) => {
        socket.username = username;
        users.push(username);
        io.emit('chat message', { username: 'System', type: 'text', content: `${username} joined the chat.` });
    });

    // Handle chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        users = users.filter(user => user !== socket.username);
        io.emit('chat message', { username: 'System', type: 'text', content: `${socket.username} left the chat.` });
    });
});

// Start the server
server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

