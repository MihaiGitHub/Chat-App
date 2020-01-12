// Load Node core module
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)

// Configure Socket.IO to work with this server
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// Listen for client connection event to occur
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    const message = 'Welcome!'

    socket.emit('message', message)

    // Listen for sendMessage event coming from client
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})