// Dependensies and Constants
const path = require('path'),
mExpress = require('express'),
http = require('http'),
socketIO = require("socket.io"),
port = 3218,
app = mExpress(),
mServer = http.createServer(app),
msgFormater = require('./messages_formater'),
botName = "chatCord bot";

// Middlewares
app.use(mExpress.static(path.join(__dirname, 'web')));

// Socket event emitations and handlers
const mIO = socketIO(mServer),
mUserIO = mIO.of('/users');
mIO.on('connection', socket => {
    console.log('New connection...');
    socket.emit('hello-message', 'Welcome. I am connected now.' );

    socket.broadcast.emit('botMessage', msgFormater(botName, 'A new user has been connected.'));

    socket.on('chatMessage',(userName, msg)=>{
        socket.broadcast.emit('chatMessage', msgFormater(userName, msg) );
    })

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('botMessage', msgFormater(botName, 'A user has been disconnected.'))
    })
})
mUserIO.on('connection', socket => {
    console.log('New connection to user...');
})

// Server initiation
mServer.listen(port, () =>{
    console.log('Started on port: '+port);
});
console.log('Hello');