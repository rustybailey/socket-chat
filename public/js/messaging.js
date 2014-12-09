var socket = io();
var nickname;

$('form').submit(function() {
  var data = {
    name: nickname,
    msg: $('#m').val()
  };

  socket.emit('chat message', data);
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

        var data = {
          name: nickname,
          msg: 'joined the room.'
        };
        socket.emit('chat message', data);
        $(this).dialog("close");
      }
    }
  ]
});