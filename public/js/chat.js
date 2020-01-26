// Call io() function to connect from client and send events from client
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Options
// Qs - query string library loaded in chat.html
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // ? goes away from query string

// Listen for event emitted from server
socket.on('message', (message) => {

    // Render message on UI
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

// Listen for locationMessage event from server
socket.on('locationMessage', (message) => {
    
    // Render message on UI
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforeend', html)
})

// When listening to form submit event we get access to e event argument
$messageForm.addEventListener('submit', (e) => {
    // Prevent full page refresh
    e.preventDefault()

    // Disable form button once the form is submitted
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        // Runs when event is acknowledged by client

        // Enable form button once message has been sent
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }

        console.log('The message was delivered!', message)
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    // Does not use promises so needs a callback function
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },
        () => { // Runs once server acknowledges event
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

// Send username and room to server and have an acknowledgement function
socket.emit('join', { username, room }, (error) => {
    // Acknowledgement function

    // Handle error
    if(error){
        alert(error)
        location.href = '/'
    }
})