Ext.define('WSChat.store.Comments', {
    extend: 'Ext.data.Store',
    requires: ['WSChat.model.Comment'],
    config: {
        storeId : 'Comments',
        model: 'WSChat.model.Comment',
        syncRemovedRecords: false,
        proxy: {
            type: 'ajax',
            url: '/ajax/comments.json',
            reader: {
                type: 'json',
                rootProperty: 'comments'
            }
        },
        autoLoad: false
    }
});