Ext.define('WSChat.store.Rooms', {
    extend: 'Ext.data.Store',
    requires: ['WSChat.model.Room'],
    config: {
        storeId : 'Rooms',
        model: 'WSChat.model.Room',
        proxy: {
            type: 'ajax',
            url: '/ajax/rooms.json',
            reader: {
                type: 'json',
                rootProperty: 'rooms'
            }
        },
        autoLoad: true
    }
});