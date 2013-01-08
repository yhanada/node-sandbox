Ext.define('WSChat.controller.ChatController', {
    extend: 'Ext.app.Controller',
    
    config: {
        socket: null,
        currentRoomId: null,
        formView: null,
        refs: {
          mainNavi: 'mainnavi',
          postViewButton: '#postviewbutton',
          roomsList: 'roomslist',
          postButton:'postform #postButton',
          commentTextArea:'postform #commentTextArea',
          commentsList: 'mainnavi commentslist'
        },
        control: {
          mainNavi: {
            //Hooking To back to previous view via the Navigation UI back.
            back: function( naviView, eOpt){
              this.getPostViewButton().hide();
            }
          },
          roomsList: {
            //To show comments
            itemtap: function( list, index, item, record){
              var commentsView = Ext.create('WSChat.view.CommentsList');
              commentsView.getStore().getProxy().setExtraParam('room_id', record.get('_id'));
              commentsView.getStore().removeAll(true);
              commentsView.getStore().load();
              list.up('mainnavi').push(commentsView);
              this.setCurrentRoomId( record.get('_id'));
              this.getPostViewButton().show();
            }
          },
          postViewButton: {
            //to show a view of posting a comment.
            tap: function( button, event, opt){
              var formView = this.getFormView();
              this.getCommentTextArea().setValue("");
              formView.showBy(button);
            }
          },
          postButton: {
            //Post a comment to current room.
            tap: function( button, event, opt){
              Ext.Ajax.request({
                method: 'post',
                url: '/comment',
                jsonData: 
                    { message: this.getCommentTextArea().getValue(), room_id: this.getCurrentRoomId()}
              });
              button.getParent().hide();
            }
          }
        }
    },
    
    //called when the Application is launched, remove if not needed
    launch: function(app) {
        //store popup view
        this.setFormView( Ext.create('WSChat.view.PostForm'));      
        
        //connect by socket.io
        var socket = io.connect();
        this.setSocket( socket);
        var self = this;
        socket.on('post', function(data) {
          if( data.room_id != self.getCurrentRoomId()){
            //if this post isn't for this room.
            return;
          }
          
          console.log(data);
          var comment = Ext.create( 'WSChat.model.Comment',
              {
                _id:data._id,
                message:data.post,
                room_id:data.room_id,
                user_id:data.user_id,
                user_name:data.user_name,
                created:data.createdAt
              });
          self.getCommentsList().getStore().insert(0,comment);
          self.getCommentsList().refresh();
          
        });
    }
});