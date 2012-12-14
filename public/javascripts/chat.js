$(function() {
  var socket   = io.connect()
    , $posts   = $('ul#posts')
    , $message = $('input#message')
    , $roomId  = $('input#room_id')
    , $status  = $('#status')
    ;

  var changeStatus = function(type, fn) {
    $.ajax({
      type: 'post',
      url: '/status',
      data: {
        type: type
      },
      success: function(data, dataType) {
        if (fn) fn();
        console.log('status success:' + data);
      },
      error: function(req, status, error) {
        if (fn) fn(error);
        console.log('status error:' + status);
      }
    });
  };

  socket.on('connect', function(data) {
    changeStatus('join', function(err) {
      if (!err) {
        $status.removeClass().addClass('connected');
      }
    });
  });

  socket.on('disconnect', function(data) {
    changeStatus('leave', function(err) {
      window.location = '/';
    });
    $status.removeClass().addClass('disconnect');
  });

  socket.on('status', function(data) {
    var $li = null;
    if (data.type === 'join') {
      $li = $('<li>').text(data.user_name + ' joined.');
    } else if (data.type === 'leave') {
      $li = $('<li>').text(data.user_name + ' left.');
    }
    if ($li) {
      $posts.prepend($li);
    }
  });

  socket.on('post', function(data) {
    var $li = $('<li>').text(data.user_name + ' say: ' + data.post);
    $posts.prepend($li);
  });

  $('input#update').on('click', function(e) {
    var message = $message.val();
    if (message.length === 0) return;
    $.ajax({
      type: 'post',
      url: '/comment',
      data: {
        message: message,
        room_id: $roomId.val()
      },
      success: function(data, dataType) {
        console.log('comment success:' + data);
      },
      error: function(req, status, error) {
        console.log('comment error:' + status);
      }
    });
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

  $('#leave').on('click', function(e) {
    socket.disconnect();
  });
});
