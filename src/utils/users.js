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
    const existingUser = users.find((user) => {
        // both username and room are true then user already exists in chatroom
        return room === user.room && user.username === username
    })

    console.log('existing user ', existingUser)

    // Validate username
    if(existingUser){
        return {
            error: 'Username is in room!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)

    return { user }
}

const removeUser = (id) => {
    // index = -1 for no match
    const index = users.findIndex((user) => {
        // return true if user.id = user we are looking for
        return user.id === id
    })

    // Remove user from users array and return the user removed
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
   return users.find((user) => user.id === id )
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}