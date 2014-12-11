var socket = io();
var messageHtmlStr =
  '<li>' +
    '<span class="message-time"><%= moment(time).format("h:mm A") %></span>' +
    '<span class="message-name"><%= name %></span>' +
    '<span class="message-msg"><%= msg %></span>' +
  '</li>';

var messageTemplate = _.template(messageHtmlStr);

$('form').submit(function() {
  var message = $('#m').val().trim();
  if (!message) {
    return false;
  }
  socket.emit('chat message', ': ' + message);
  $('#m').val('');
  return false;
});

socket.on('chat message', function(data) {
  $('#messages').append(messageTemplate(data));
});

socket.on('user count', function(num) {
  $('.user-count').text(num);
});


$('.choose-name').dialog({
  title: "Choose your nickname",
  resizable: false,
  draggable: false,
  move: false,
  modal: true,
  open: function() {
    $('.choose-name').on('keyup input', '.nickname', function(e) {
      if (e.which === 13) {
        $('.ui-dialog-buttonset .ui-button').click();
      }
    });
  },
  buttons: [
    {
      text: "Ok",
      click: function() {
        var nickname = $('.nickname').val().trim();

        if (!nickname) {
          alert('You must choose a nickname!');
          return;
        }

        socket.emit('add user', nickname);
        socket.emit('chat message', ' joined the room.');

        $(this).dialog("close");
      }
    }
  ]
});