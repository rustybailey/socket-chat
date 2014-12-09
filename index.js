var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);

var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('chat message', function(data) {
    console.log('message: ' + data.msg);

    io.emit('chat message', data);
  });
});