Ext.define('WSChat.view.RoomsListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype: 'roomslistitem',
    requires: [
        'Ext.data.Store',
        'Ext.Img',
        'Ext.Label',
    ],
    config: {
        layout: 'fit',
        items: [
                {
                    xtype: 'button',
                    itemId:'room',
                    ui: 'plain',
                    flex: 1,
                    width: "100%", height: "100%",
                    listeners: {
                        tap: function( comp, event, eOpt){
                          //console.log(comp);
                          this.getParent().fireItemTap( comp, event, eOpt);
                        }
                    }
                },//, bubbleEvents: ''//, disabled: true},
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
                
                //console.log(newData);
              
                if(newData != null){
                  listItem.getComponent('room').setHtml(newData.title);
                  listItem.getComponent('date').setHtml(newData.updated.toLocaleString());
                }
            }
        }        
    },
    
    fireItemTap: function( comp, event, eOpt){
        var listItem = comp.getParent();
        console.log(this);
        console.log(comp);
        //console.log(listItem);
        //console.log(listItem.getRecord());
        //console.log(listItem.getParent());
        //console.log(listItem.getXTypes());
        listItem.getParent().getParent().fireEvent( 'itemtap', listItem.getParent(), -1, listItem, listItem.getRecord());
    }
});
