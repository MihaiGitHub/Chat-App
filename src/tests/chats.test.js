const chats = require('../utils/messages')

test('Should return the users message', () => {

    const expected = { username: 'Adam', text: 'A new message from Adam' }
    
    expect(chats.generateMessage('Adam', 'A new message from Adam')).toMatchObject(expected)

})

test('Should return the users location info', () => {

    const expected = { username: 'Mike', url: 'https://www.google.com/maps' }
    
    expect(chats.generateLocationMessage('Mike', 'https://www.google.com/maps')).toMatchObject(expected)

})