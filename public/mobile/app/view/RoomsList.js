Ext.define('WSChat.view.RoomsList', {
    extend: 'Ext.List',
    xtype: 'roomslist',
    requires: [
        'Ext.data.Store'
    ],
    config: {
        title: 'Rooms',
        iconCls: 'info',
        items: [
            {
              docked: 'top',
              xtype: 'titlebar',
              title: 'Available Rooms'
            },
        ],
        store: 'Rooms',
        itemTpl: '<span style="display:inline-block;width:90px;text-align:left;">'+
                 '{title}' +
                 '</span>' +
                 '<span>{updated}</span>',
    }
});
