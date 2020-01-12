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

    // Will send this event to everyone except this particular socket
    socket.broadcast.emit('message', 'A new user has joined!')

    // Listen for sendMessage event coming from client
    socket.on('sendMessage', (message, callback) => {
        // Send event to all connections
        io.emit('message', message)

        // Callback function that runs after event has been acknowledged by client
        callback('Delivered!')
    })

    // Listen for sendLocation event coming from client
    socket.on('sendLocation', (coords) => {
        // Send event to all connections with lat and long
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })
    
    // Built in event for client disconnect
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})