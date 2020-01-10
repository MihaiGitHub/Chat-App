// Call io() function to connect from client and send events from client
const socket = io()

// Listen for event emitted from server
socket.on('message', (message) => {
    console.log(message)
})
