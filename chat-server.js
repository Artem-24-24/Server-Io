const express = require('express');
const app = express();
const http = require('http').Server(app) ;
const io = require('socket.io')(http);
const util = require('util');

const hostname = '127.0.0.1'
const port = 3000

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/chat-client.html');
});

io.on('connection', function(socket) {
    console.log('a user connected ');
    io.emit('rooms', getRooms('connected'));
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('new room', function (room) {
        console.log(`A new room is created ${room}`);
        socket.room = room;
        socket.join(room);
        io.emit('rooms', getRooms('new room'));
    });
    socket.on('join room', function (room) {
        console.log(`A new user joined room ${room}`);
        socket.room = room;
        socket.join(room);
        io.emit('rooms', getRooms(' joined room'));
    });
    socket.on('chat message', function (data) {
        console.log("\"Received message\" >>" + util.inspect(data))
        io.in(data.room).emit('chat message', `${data.name}: ${data.msg}`);
    });
    socket.on('set username', function (name) {
        console.log(`username set to ${name}(${socket.id})`);
        socket.username = name;
    });
});

http.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
        });

function getRooms(msg) {
    const nsp = io.of('/');
    const rooms = nsp.adapter.rooms;

    /*Returns data in this form
    {
       ‘roomid1': { 'socketid1', socketid2', ...},
              ...
    }
    */
    console.log('getRooms rooms>>' + util.inspect(rooms));

    const list = {};

    for (let roomId of rooms.keys()) {
        const room = rooms.get(roomId);
        if (room === undefined) continue;
        const sockets = [];
        let roomName = "";
        //console.log('getRooms room>>' + util. inspect(room) );
        for (let socketId of room) {
            const socket = nsp.sockets.get(socketId);
            if (socket === undefined || socket.username === undefined || socket.room === undefined || socket.room !== roomId) continue;
            //console.log(`getRooms socket (${socketId})>>${socket.username}:${socket. room}` );
            sockets.push(socket.username);
            if (roomName == "") roomName = socket.room;
        }
        if (roomName != "") list[roomName] = sockets;
    }

    console.log(`getRooms: ${msg} >>` + util.inspect(list));

    return list;
}