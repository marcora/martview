Ext.namespace('Martview');

Martview.Footer = Ext.extend(Ext.Toolbar, {

    // hard config - cannot be changed from outside
    initComponent: function() {

        // add config here
        var config = {
            region: 'south',
            id: 'footer',
            // FIX: should adjust height automatically
            height: 26,
            items: [{
                id: 'tip',
                text: 'Select a query form to begin',
                iconCls: 'tip_icon',
                cls: 'x-btn-text-icon',
                handler: function() {
                    Ext.MessageBox.alert(Martview.APP_TITLE, 'More tip');
                }
            }]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Martview.Footer.superclass.initComponent.apply(this, arguments);
    }

});

Ext.reg('footer', Martview.Footer);

//   [{
//      text: 'Mart 1',
//      iconCls: 'table_multiple_icon',
//      menu: {
//        items: [{
//          text: 'Dataset 1.1',
//          iconCls: 'table_icon'
//          },'-',{
//          text: 'Dataset 1.2',
//          iconCls: 'table_icon'
//          },'-',{
//          text: 'Dataset 1.3',
//          iconCls: 'table_icon'
//        }]
//      }
//      },'-',{
//      text: 'Mart 2',
//      iconCls: 'table_multiple_icon',
//      menu: {
//        items: [{
//          text: 'Dataset 2.1',
//          iconCls: 'table_icon'
//          },'-',{
//          text: 'Dataset 2.2',
//          iconCls: 'table_icon'
//          },'-',{
//          text: 'Dataset 2.3',
//          iconCls: 'table_icon'
//        }]
//      }
//   }];
