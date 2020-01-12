// Call io() function to connect from client and send events from client
const socket = io()

// Listen for event emitted from server
socket.on('message', (message) => {
    console.log(message)
})

// When listening to form submit event we get access to e event argument
document.querySelector('#message-form').addEventListener('submit', (e) => {
    // Prevent full page refresh
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message)
})