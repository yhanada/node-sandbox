Ext.define('WSChat.view.PostForm', {
    extend: 'Ext.form.Panel',
    xtype: 'postform',
    requires: [
        'Ext.form.FieldSet',
    ],
    config: {
        title: 'WSChat',
        floating: true,
        modal: true,
        //centered: true,
        width : 300,
        height : 200,
        hideOnMaskTap: true,
        layout : {
          align : "center",
          pack : "center"
        },
        items: [
            {
              xtype: 'textareafield',
              id: 'commentTextArea',
              listeners: {
              }
            },
            {
              xtype: 'button',
              id: 'postButton',
              text: 'post',
            },
        ],
        listeners: {
        }       
    }
});
