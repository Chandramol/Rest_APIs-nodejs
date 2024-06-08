const express = require('express');
const http = require('http');
const {storeDataInDB } = require("./app");
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
        storeDataInDB({ userid: data.userid, message: data.message,source:'user' })
        .then(() => console.log('Message stored in DB'))
        .catch(err => console.error('DB error:', err));
        socket.to('adminsocket').emit('message_to_admin', data);
    });

    socket.on('message_from_admin', (data) => {
        storeDataInDB({ userid: data.userid, message: data.message,source:'admin' })
        .then(() => console.log('Message stored in DB'))
        .catch(err => console.error('DB error:', err));
        socket.to(data.userid).emit('message_to_user',data)
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(8088, () => {
    console.log('Listening on port 8088');
});