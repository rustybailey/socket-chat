var socket = io();
var nickname;

$('form').submit(function() {
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function(data) {
  $('#messages').append($('<li>').text(data.name + ': ' + data.msg));
});


$('.choose-name').dialog({
  title: "Choose your nickname",
  buttons: [
    {
      text: "Ok",
      click: function() {
        nickname = $('.nickname').val();

        socket.emit('add user', nickname);
        socket.emit('chat message', 'joined the room.');

        $(this).dialog("close");
      }
    }
  ]
});