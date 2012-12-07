$(function() {
  var socket   = io.connect()
    , $posts   = $('ul#posts')
    , $message = $('input#message')
    ;

  socket.on('login', function(data) {
    var $li = $('<li>').text(data + ' joined.');
    $posts.prepend($li);
  });

  socket.on('post', function(data) {
    var $li = $('<li>').text(data.id + ' say: ' + data.post);
    $posts.prepend($li);
  });

  $('input#update').on('click', function(e) {
    var message = $message.val();
    if (message.length === 0) return;
    socket.emit('post', message);
    $message.val('');
  });
});
