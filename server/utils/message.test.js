const expect = require('expect')
const { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
  it('Should generate correct message', () => {
    const from = 'Roman'
    const text = 'Hi there!'
    const message = generateMessage(from, text)

    expect(typeof message.createdAt).toBe('number')
    expect(message).toMatchObject({ from, text })
  })
})

describe('generateLocationMessage', () => {
  it('Should generate correct location message', () => {
    const from = 'User'
    const url = 'https://google.com/maps?q=1,1'
    
    const message = generateLocationMessage(from, 1, 1)

    expect(typeof message.createdAt).toBe('number')
    expect(message).toMatchObject({ from, url })
  })
})
