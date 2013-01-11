Ext.define('WSChat.view.RoomsListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype: 'roomslistitem',
    requires: [
        'Ext.data.Store',
        'Ext.Img',
        'Ext.Label',
    ],
    config: {
        //Editable
        isEditable: false,  
      
        layout: {
            type: 'fit',
            align: 'streach',
            pack: 'center',
        },
        items: [
                {
                  xtype: 'panel',
                  docked: 'left',
                  layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'center',
                  },
                  items: [
                          {
                              xtype: 'button',
                              itemId:'delete',
                              iconCls: 'delete',
                              ui: 'decline',
                              iconMask: true,
                              hidden: true,
                              listeners: {
                                  tap: function( comp, event, eOpt){
                                    var listItem = comp.up('roomslistitem');
                                    listItem.fireDeleteItemTap( listItem, comp, event, eOpt);
                                  }
                              }
                          }]
              },
                {
                    xtype: 'button',
                    itemId:'room',
                    ui: 'plain',
                    //flex: 1,
                    width: "100%", height: "100%",
                    listeners: {
                        tap: function( comp, event, eOpt){
                          var listItem = comp.up('roomslistitem');
                          listItem.fireItemTap( listItem, comp, event, eOpt);
                        }
                    }
                },
                {
                    xtype: 'label',
                    itemId:'date',
                    docked: 'bottom',
                    style: 'font-size: 75%',
                    listeners: {
                      tap: function( comp, event, eOpt){
                        console.log(comp);
                      }
                    }
                },
                ],
        listeners: {
            updatedata: function( listItem, newData, eOpts ){
                if(newData != null){
                  listItem.getComponent('room').setHtml(newData.title);
                  listItem.getComponent('date').setHtml(newData.updated.toLocaleString());
                }
            }
        }        
    },
    
    fireItemTap: function( listItem, comp, event, eOpt){
        if( this.getIsEditable()){
            return;
        }  
      
        var list = listItem.up('roomslist');
        list.fireEvent( 'itemtap', list, -1, listItem, listItem.getRecord());
    },

    fireDeleteItemTap: function( listItem, comp, event, eOpt){
      if( !this.getIsEditable()){
          return;
      }  
    
      var list = listItem.up('roomslist');
      list.fireEvent( 'deleteitemtap', list, -1, listItem, listItem.getRecord());
    },
    
    updateIsEditable: function( newValue, oldValue){
          var button = this.down('#delete');
          if( button){
              if( newValue){
                  button.show();
              }else{
                  button.hide();
              }
          }
    }
});
