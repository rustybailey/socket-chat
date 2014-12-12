var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);

var io = require('socket.io').listen(server),
  userNames = {},
  numUsers = 0;

io.on('connection', function(socket) {
  var createMessage = function(msg) {
    console.log('message: ' + msg);

    var data = {
      name: socket.nickname,
      msg: msg,
      time: new Date()
    };

    io.emit('show chat message', data);
  };

  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');

    if (socket.nickname) {
      createMessage(' left the room.');
      delete userNames[socket.nickname];
      numUsers--;
      io.emit('user count', numUsers);
      io.emit('user list', userNames);
    }
  });

  socket.on('create chat message', createMessage);

  socket.on('add user', function(user) {
    // TODO: Check if that username exists, if so, add a random string of 4 numbers
    socket.nickname = user;
    userNames[user] = user;
    numUsers++;

    io.emit('user count', numUsers);
    io.emit('user list', userNames);
  });

  socket.on('typing', function(length) {
    var data = {
      id: socket.id,
      name: socket.nickname,
      msg: ' is typing...'
    };

    if (length) {
      socket.broadcast.emit('show typing', data);
    } else {
      socket.broadcast.emit('hide typing', data);
    }
  });
});