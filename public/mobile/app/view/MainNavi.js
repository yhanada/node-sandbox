Ext.define('WSChat.view.MainNavi', {
    extend: 'Ext.NavigationView',
    xtype: 'mainnavi',
    requires: [
        'WSChat.view.RoomsList',
        'WSChat.view.CommentsList'
    ],
    config: {
        title: 'WSChat',
      
        items: [
            {
              xtype: 'roomslist',
              listeners: {
                itemtap: function( list, index, item, record){
                  var commentsView = Ext.create('WSChat.view.CommentsList');
                  commentsView.getStore().getProxy().setExtraParam('room_id', record.get('_id'));
                  commentsView.getStore().removeAll(true);
                  commentsView.getStore().load();
                  this.up('mainnavi').push(commentsView);
                }
              }
            },
        ]
    }
});
