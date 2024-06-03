const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('admin_connection',()=>{
        console.log('Admin connected');
        socket.join('adminsocket');
    })

    socket.on('user_connection',(userid)=>{
        console.log('user connected');
        socket.join(userid);
    })

    socket.on('message_from_user', (data) => {
        socket.to('adminsocket').emit('message_to_admin', data);
    });

    socket.on('message_from_admin', (data) => {
        socket.to(data.userid).emit('message_to_user',data)
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(8088, () => {
    console.log('Listening on port 8088');
});