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
  socket.emit('create chat message', ': ' + message);
  $('#m').val('');
  return false;
});

socket.on('show chat message', function(data) {
  $('#messages').append(messageTemplate(data));
});

socket.on('user count', function(num) {
  $('.user-count').text(num);
});

socket.on('show typing', function(data) {
  var typingSpan = $('.typing.' + data.id);

  if (!typingSpan.length) {
    $('.typing-container').append('<div class="typing ' + data.id + '">' + data.name + data.msg + '</div>');
  }
});

socket.on('hide typing', function(data) {
  var typingSpan = $('.typing.' + data.id);

  if (typingSpan.length) {
    typingSpan.remove();
  }
});

$(document).on('keyup', '#m', function(e) {
  socket.emit('typing', $('#m').val().trim().length);
});


$('.choose-name').dialog({
  title: "Choose your nickname",
  resizable: false,
  draggable: false,
  move: false,
  modal: true,
  open: function() {
    $('.choose-name').on('keyup', '.nickname', function(e) {
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
        socket.emit('create chat message', ' joined the room.');

        $(this).dialog("close");
        $('#m').focus();
      }
    }
  ]
});