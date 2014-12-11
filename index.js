var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);

var io = require('socket.io').listen(server),
  numUsers = 0;

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');

    var data = {
      name: socket.nickname,
      msg: 'left the room.'
    };

    if (socket.nickname) {
      io.emit('chat message', data);
      console.log('message: ' + data.msg);
      numUsers--;
      io.emit('user count', numUsers);
    }
  });

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);

    var data = {
      name: socket.nickname,
      msg: msg,
      time: new Date()
    };

    io.emit('chat message', data);
  });

  socket.on('add user', function(user) {
    socket.nickname = user;

    numUsers++;
    io.emit('user count', numUsers);
  });
});