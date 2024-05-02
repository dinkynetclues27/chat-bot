require('dotenv').config();
const express = require('express')
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
let users = [];

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} connected!`);

    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data);
      });

      socket.on('newUser', (data) => {
        
        users.push(data);
        socketIO.emit('newUserResponse', users);
      });
    socket.on('disconnect', () => {
      console.log('disconnected');
      users = users.filter((user) => user.socketID !== socket.id);
      socketIO.emit('newUserResponse', users);
      socket.disconnect();
    });
});

http.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
