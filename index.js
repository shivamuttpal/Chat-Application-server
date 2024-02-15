const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const users = {};

// Socket.io events
io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

// HTTP server for handling GET requests
app.get('/hello', (req, res) => {
  res.send('Hello, this is my chat backend');
});

// Start the HTTP server
const PORT = 8000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
