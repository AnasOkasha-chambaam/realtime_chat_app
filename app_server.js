// Dependensies and Constants
const path = require('path'),
  mExpress = require('express'),
  http = require('http'),
  socketIO = require('socket.io'),
  port = 3218,
  app = mExpress(),
  mServer = http.createServer(app),
  msgFormater = require('./helpers/messages_formater'),
  botName = 'chatCord bot',
  { joinUser, findById, roomUsers, removeUser } = require('./helpers/users')

// Middlewares
app.use(mExpress.static(path.join(__dirname, 'web')))

const mIO = socketIO(mServer),
  mUserIO = mIO.of('/users')
// Socket event emitations and handlers
mIO.on('connection', socket => {
  console.log('New connection...')
  socket.emit('hello-message', 'Welcome. I am connected now.')

  socket.on('joinRoom', (username, room) => {
    const user = joinUser(socket.id, username, room);
    // join room
    socket.join(user.room);
    // send info
    mIO.to(room).emit('joiningInfo', { roomUsers: roomUsers(room).map(user => {
      return {name:user.name, me: (user.id === socket.id)? true: false}
    }), room });
    // send hello message
    socket.broadcast.to(user.room).emit('botMessage', msgFormater(botName, user.name + ' has been connected.'))
    // handle chat message
    socket.on('chatMessage', (userName, msg) => {
      socket.broadcast.to(user.room).emit('chatMessage', msgFormater(userName, msg, 'chat'))
    })
    // handle me message
    socket.on('meMessage', (userName, msg) => {
      socket.emit('chatMessage', msgFormater(userName, msg, 'me'));
    })
    // handle the disconnect
    socket.on('disconnect', () => {
      removeUser(user.id);
      mIO.to(room).emit('joiningInfo', { roomUsers: roomUsers(room), room });
      socket.broadcast.to(user.room).emit('botMessage', msgFormater(botName, user.name + ' has been disconnected.'));
    })
  })
})
mUserIO.on('connection', socket => {
  console.log('New connection to user...')
})

// Server initiation
mServer.listen(port, () => {
  console.log('Started on port: ' + port)
})
console.log('Hello')
