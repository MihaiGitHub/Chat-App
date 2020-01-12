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

    socket.emit('sendMessage', message, (error) => {
        // Runs when event is acknowledged by client

        if(error){
            return console.log(error)
        }

        console.log('The message was delivered!', message)
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    // Does not use promises so needs a callback function
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})