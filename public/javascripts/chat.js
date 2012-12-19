$(function() {
  var socket   = io.connect()
    , $posts   = $('ul#posts')
    , $message = $('input#message')
    , $roomId  = $('input#room_id')
    , $status  = $('#status')
    , $messages = $('#messages')
    ;

  var changeStatus = function(type, fn) {
    $.ajax({
      type: 'post',
      url: '/status',
      data: {
        type: type,
        room_id: $roomId.val()
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
    var roomId = data.room_id;
    if ($roomId.val() !== roomId) {
      return;
    }
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
    //Pick a current room ID.
    var roomId = $('#room_id').attr('value');
    if( data.room_id != roomId){
      //if this post isn't for this room.
      return;
    }
    
    //Pick a user id for current user.
    var $userId = $('#user_id').text();
    
    var line = "";
    
    if(data.user_id == undefined){
      line += '<img src="http://graph.facebook.com/1/picture"/>';
    }else{
      line += '<img src="http://graph.facebook.com/'+data.user_id+'/picture"/>';
    }

    if( data.user_id == $userId){
      line += '<span style="display:inline-block;width:75px;text-align:right;"><strong>You</strong>:</span>';
    }else{
      line += data.user_id+'<span style="display:inline-block;width:75px;text-align:right;">'+data.user_name+':</span>';
    }
    line += '<span>'+data.post+'</span>';

    var $li = $('<li>').html(line);
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
    $messages.hide();
    socket.disconnect();
  });
});
