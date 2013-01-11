Ext.define('WSChat.controller.ChatController', {
    extend: 'Ext.app.Controller',
    requires: [
               'WSChat.view.RoomsList',
               'WSChat.view.CommentsList',
               'WSChat.view.PostForm',
               'WSChat.view.CreateRoomForm',
           ],
    
    config: {
        socket: null,
        currentRoomId: null,
        formView: null,
        createRoomFormView: null,
        commentsView: null,
        refs: {
          mainNavi: 'mainnavi',
          postViewButton: '#postviewbutton',
          createRoomViewButton: '#createroomviewbutton',
          editRoomsButton: '#editroomsbutton',

          roomsList: 'roomslist',
          postButton:'postform #postButton',
          commentTextArea:'postform #commentTextArea',
          commentsList: 'mainnavi commentslist',
          
          createRoomButton:'createroomform #createRoomButton',
          roomNameTextField:'createroomform #roomNameTextField',
          roomsList: 'mainnavi roomslist'
            
        },
        control: {
          mainNavi: {
            //Hooking To back to previous view via the Navigation UI back.
            back: function( naviView, eOpt){
              this.getPostViewButton().hide();
              this.getCreateRoomViewButton().show();
              this.getEditRoomsButton().show();
            }
          },
          roomsList: {
            //To show comments
            itemtap: function( list, index, item, record){
              var commentsView = this.getCommentsView();
              commentsView.getStore().getProxy().setExtraParam('room_id', record.get('_id'));
              commentsView.getStore().load();
              list.up('mainnavi').push(commentsView);
              this.setCurrentRoomId( record.get('_id'));
              this.getPostViewButton().show();
              this.getCreateRoomViewButton().hide();
              this.getEditRoomsButton().hide();
            },
            //To delete room
            deleteitemtap: function( list, index, item, record){
              var self = this;
              console.log(record);
              console.log('roomId:'+record.get('_id'));
              Ext.Ajax.request({
                method: 'delete',
                url: '/ajax/delete/room.json',
                jsonData: 
                    { roomId: record.get('_id')},
                success: function( response, opts){
                  var result = Ext.decode(response.responseText);
                  if(result.result == 'success'){
                    //reload rooms list
                    self.getRoomsList().getStore().load();
                  }
                },
                failure: function( response, opts){
                  //DONOTHING
                },
              });
            }
          },
          editRoomsButton: {
            //to show a view of posting a comment.
            tap: function( button, event, opt){
              var iconCls = button.getIconCls();
              var editable = true;
              if( iconCls == 'compose'){
                  button.setIconCls('');
                  button.setText('Cancel');
                  this.getCreateRoomViewButton().disable();
                  editable = true;
              }else{
                  button.setIconCls('compose');
                  button.setText('');
                  this.getCreateRoomViewButton().enable();
                  editable = false;
              }
              
              var listItems = this.getRoomsList().query('.roomslistitem');
              listItems.forEach(function(listItem){
                  listItem.setIsEditable(editable);
              });
            }
          },
          createRoomViewButton: {
            //to show a view of posting a comment.
            tap: function( button, event, opt){
              var formView = this.getCreateRoomFormView();
              //console.log(this.getRoomNameTextField());
              this.getRoomNameTextField().setValue("");
              formView.showBy(button);
            }
          },
          createRoomButton: {
            //Post a comment to current room.
            tap: function( button, event, opt){
              var self = this;
              Ext.Ajax.request({
                method: 'post',
                url: '/ajax/create/room.json',
                jsonData: 
                    { name: this.getRoomNameTextField().getValue()},
                success: function( response, opts){
                  var result = Ext.decode(response.responseText);
                  if(result.result == 'success'){
                    //reload rooms list
                    self.getRoomsList().getStore().load();
                    button.getParent().hide();
                  }
                },
                failure: function( response, opts){
                  //DONOTHING
                },
              });
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
        //store popup view for creating a room
        this.setCreateRoomFormView( Ext.create('WSChat.view.CreateRoomForm'));      
        //store 
        this.setCommentsView( Ext.create('WSChat.view.CommentsList'));

        
        //connect by socket.io
        var socket = io.connect();
        this.setSocket( socket);
        var self = this;
        socket.on('post', function(data) {
          if( data.room_id != self.getCurrentRoomId()){
            //if this post isn't for this room.
            return;
          }
          
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