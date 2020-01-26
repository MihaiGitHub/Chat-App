// Load Node core module
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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
    socket.on('join', (options, callback) => {

        // Use the socket id as the user id to add a user once connected
        const { error, user } = addUser({ id: socket.id, ...options })

        if(error){
            return callback(error)
        }

        // Method for joining a chat room
        socket.join(user.room)

        // Send an object from server to client
        socket.emit('message', generateMessage('Admin', 'Welcome!'))

        // Will send this event to everyone except this particular socket
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        // Let the client know the user was able to join without an error
        callback()
    })

    // Listen for sendMessage event coming from client
    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id)       
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }

        // Send event to all connections
        io.to(user.room).emit('message', generateMessage(user.username, message))

        // Callback function that runs after event has been acknowledged by client
        callback('Delivered!')
    })

    // Listen for sendLocation event coming from client
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        // Send event to all connections with lat and long
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        // Let client know the event has been acknowledged
        callback()
    })
    
    // Built in event for client disconnect
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})