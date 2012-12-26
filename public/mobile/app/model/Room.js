Ext.define('WSChat.model.Room', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            {name: '_id', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'created', type: 'date'},
            {name: 'updated', type: 'date'}
        ]
    }
});