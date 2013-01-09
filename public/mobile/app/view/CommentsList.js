Ext.define('WSChat.view.CommentsList', {
    extend: 'Ext.List',
    xtype: 'commentslist',
    requires: [
        'Ext.data.Store',
        'WSChat.view.CommentsListItem'
    ],
    config: {
        title: 'Comments',
        iconCls: 'info',
        store: 'Comments',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        disableSelection: true,
        useComponents: true,
        defaultType: 'commentslistitem'
    }
});
