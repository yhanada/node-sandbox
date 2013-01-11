Ext.define('WSChat.view.MainNavi', {
    extend: 'Ext.NavigationView',
    xtype: 'mainnavi',
    requires: [
        'WSChat.view.RoomsList',
        'WSChat.view.CommentsList'
    ],
    config: {
        title: 'WSChat',
        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    id: 'postviewbutton',
                    text: 'post',
                    align : 'right',
                    hidden : true,
                },
                {
                  xtype: 'button',
                  id: 'createroomviewbutton',
                  iconCls: 'add',
                  iconMask: true,                  
                  align : 'right',
                  hidden : false,
                }

            ]
        },
        items: [
            {
              xtype: 'roomslist',
            },
        ],
        autoDestroy: false
    }
});
