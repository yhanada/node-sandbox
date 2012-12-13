$(function() {
  var socket   = io.connect()
    , $posts   = $('ul#posts')
    , $message = $('input#message')
    , $roomId  = $('input#room_id')
    , $userId  = $('input#user_id')
    , $status  = $('#status')
    ;

  socket.on('connect', function(data) {
    $status.removeClass().addClass('connecting');
  });

  socket.on('disconnect', function(data) {
    $status.removeClass().addClass('disconnect');
  });

  socket.on('login', function(data) {
    $status.removeClass().addClass('connected');
    var $li = $('<li>').text(data + ' joined.');
    $posts.prepend($li);
  });

  socket.on('post', function(data) {
    var $li = $('<li>').text(data.user_name + ' say: ' + data.post);
    $posts.prepend($li);
  });

  $('input#update').on('click', function(e) {
    var message = $message.val();
    if (message.length === 0) return;
    socket.emit('post', {message: message, room_id: $roomId.val(), user_id:$userId.val()} );
    $message.val('');
  });

  // handle enter key
  $('#message').keypress(function(e) {
    if (e.which === 13) {
      $(this).blur();
      $('input#update').click();
      $(this).focus();
    }
  });
});
