const userFunctions = require('../utils/users')

test('Should return the user added to the chat room', () => {

    const user1 = { id: 1, username: 'Andrew', room: 'East' }
    
    const expected = {
        user: {
            id: 1, username: 'andrew', room: 'east'
        }
    }

    expect(userFunctions.addUser(user1)).toMatchObject(expected)

})

test('Should return the users in chat room', () => {
    
    expect(userFunctions.getUsersInRoom('east')).toMatchObject([{"id": 1, "room": "east", "username": "andrew"}])

})

test('Should return one user from the chat room', () => {
    
    expect(userFunctions.getUser(1)).toMatchObject({"id": 1, "room": "east", "username": "andrew"})

})

test('Should return the user removed from the chat room', () => {
    
    expect(userFunctions.removeUser(1)).toMatchObject({"id": 1, "room": "east", "username": "andrew"})

})