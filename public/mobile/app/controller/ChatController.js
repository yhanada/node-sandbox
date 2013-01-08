Ext.define('WSChat.controller.ChatController', {
    extend: 'Ext.app.Controller',
    
    config: {
        socket: null,
        currentRoomId: null,
        refs: {
          mainNavi: 'mainnavi',
          postViewButton: '#postviewbutton',
          roomsList: 'roomslist',
          postButton:'postform #postButton',
          commentTextArea:'postform #commentTextArea'
        },
        control: {
          mainNavi: {
            //Hooking To back to previous view via the Navigation UI back.
            back: function( naviView, eOpt){
              
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
            }
          },
          postViewButton: {
            //to show a view of posting a comment.
            tap: function( button, event, opt){
              var formView = Ext.create('WSChat.view.PostForm');
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
        //connect by socket.io
        var socket = io.connect();
        this.setSocket( socket);
    }
});