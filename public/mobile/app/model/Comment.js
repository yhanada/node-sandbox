Ext.define('WSChat.model.Comment', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: '_id', type: 'string'},
            {name: 'message', type: 'string'},
            {name: 'room_id', type: 'string'},
            {name: 'user_id', type: 'string'},
            {name: 'user_name', type: 'string'},
            {name: 'created', type: 'date'}
        ]
    }
});