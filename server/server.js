const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/Users')

const app = express()

const publicPath = path.join(__dirname + '/../public')
const port = process.env.PORT || 3000

const server = http.createServer(app)
const io = socketIO(server)
const users = new Users()
app.use(express.static(publicPath))

io.on('connection', socket => {

  socket.on('join', (params, callback) => {
    const { name, room } = params
    if (!isRealString(name) && !isRealString(room)) {
      return callback('Name and room are required')
    }
    socket.join(room)

    // Add user and send updated list
    users.removeUser(socket.id)
    users.addUser({ id: socket.id, name, room })
    io.to(room).emit('updateUserList', users.getUserList(room))

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat!'))
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} joined chat`))
    callback()
  })

  socket.on('createMessage', (msg, callback) => {
    const { name, room } = users.getUser(socket.id)
    io.to(room).emit('newMessage', generateMessage(name, msg))
    callback('Message has successfully received!')
  })

  socket.on('createLocationMessage', ({ latitude, longitude }) => {
    const { name, room } = users.getUser(socket.id)
    io.to(room).emit('newLocationMessage', generateLocationMessage(name, latitude, longitude))
  })

  socket.on('disconnect', () => {
    const removedUser = users.removeUser(socket.id)
    if (removedUser) {
      io.to(removedUser.room).emit('updateUserList', users.getUserList(removedUser.room))
      socket.broadcast.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} left chat.`))
    }
  })
})

server.listen(port, () => console.log('Server is app on port 3000'))