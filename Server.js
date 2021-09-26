const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const hostname = '127.0.0.1'
const port = 3000

app.get('/', (req, res) =>
    res.sendFile(__dirname + '/socketIo.html')
);

io.on('connection', socket => {
    console.log('A user connected')

    socket.on('disconnection', () => {
        console.log('A user disconnected')
    })

    socket.on('chat message', msg => {
        console.log(msg)
        io.emit('chat message', msg)
    })
})

http.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});