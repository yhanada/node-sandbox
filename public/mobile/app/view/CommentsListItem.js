Ext.define('WSChat.view.CommentsListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype: 'commentslistitem',
    requires: [
        'Ext.data.Store',
        'Ext.Img',
        'Ext.Label',
    ],
    config: {
        layout: 'hbox',
        items: [
                {xtype: 'panel', itemId:'comment', flex: 1, width: "100%", height: "100%"},
                {xtype: 'image', itemId:'thumbnail', docked: 'left', width: "50px", height: "50px"},
                {xtype: 'label', itemId:'date', docked: 'bottom', style: 'font-size: 75%'},
                ],
        listeners: {
            updatedata: function( listItem, newData, eOpts ){
                
                if(newData != null){
                  if( newData.user_id ){
                    listItem.getComponent('thumbnail').setSrc("http://graph.facebook.com/"+newData.user_id+"/picture");
                  }else{
                    listItem.getComponent('thumbnail').setSrc("http://graph.facebook.com/1/picture");
                  }
                  listItem.getComponent('comment').setHtml(newData.message);
                  listItem.getComponent('date').setHtml(newData.created.toLocaleString());
                }
            }
        }        
    },
});
