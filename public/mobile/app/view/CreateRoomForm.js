Ext.define('WSChat.view.CreateRoomForm', {
    extend: 'Ext.form.Panel',
    xtype: 'createroomform',
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
              xtype: 'textfield',
              id: 'roomNameTextField',
            },
            {
              xtype: 'button',
              id: 'createRoomButton',
              text: 'create',
            },
        ],
    }
});
