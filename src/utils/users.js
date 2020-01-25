// File to keep track of users
const users = []

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find(() => {
        // both username and room are true then user already exists in chatroom
        return username.room === room && username.username === username
    })

    // Validate username
    if(existingUser){
        return {
            error: 'Username is in user!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)

    return { user }
}

