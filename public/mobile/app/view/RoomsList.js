Ext.define('WSChat.view.RoomsList', {
    extend: 'Ext.List',
    xtype: 'roomslist',
    requires: [
        'Ext.data.Store',
        'WSChat.view.RoomsListItem',
    ],
    config: {
        title: 'Rooms',
        iconCls: 'info',
        store: 'Rooms',
        scrollable: {
          direction: 'vertical',
          directionLock: true
        },
        disableSelection: true,
        useComponents: true,
        defaultType: 'roomslistitem',
        
        /*itemTpl: '<span style="display:inline-block;width:90px;text-align:left;">'+
                 '{title}' +
                 '</span>' +
                 '<span>{updated}</span>',*/
    }
});
