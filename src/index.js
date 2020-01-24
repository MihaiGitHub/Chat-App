// Load Node core module
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

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

    // Setup listener for join
    socket.on('join', ({ username, room }) => {
        // Method for joining a chat room
        socket.join(room)

        // Send an object from server to client
        socket.emit('message', generateMessage('Welcome!'))

        // Will send this event to everyone except this particular socket
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
    })

    // Listen for sendMessage event coming from client
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        // Send event to all connections
        io.emit('message', generateMessage(message))

        // Callback function that runs after event has been acknowledged by client
        callback('Delivered!')
    })

    // Listen for sendLocation event coming from client
    socket.on('sendLocation', (coords, callback) => {
        // Send event to all connections with lat and long
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        // Let client know the event has been acknowledged
        callback()
    })
    
    // Built in event for client disconnect
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})