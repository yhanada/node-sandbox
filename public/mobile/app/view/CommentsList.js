Ext.define('WSChat.view.CommentsList', {
    extend: 'Ext.List',
    xtype: 'commentslist',
    requires: [
        'Ext.data.Store'
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
        itemTpl: '<span style="display:inline-block;width:50px;text-align:left;">'+
                    '<img src="http://graph.facebook.com/{user_id}/picture"/>'+
                 '</span>'+
                 '<span style="display:inline-block;width:auto;>'+
                 '<span style="display:inline-block;width:20%;text-align:left;">{user_name}</span>'+
                 '<span style="display:inline-block;width:80%;text-align:left;">'+
                 '{message}' +
                 '</span>' +
                 '</span>',
                 
    }
});
