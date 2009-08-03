Ext.namespace('Martview');

Martview.Header = Ext.extend(Ext.Toolbar, {

    // hard config - cannot be changed from outside
    initComponent: function () {

        // add config here
        var config = {
            region: 'north',
            id: 'header',
            // FIX: should adjust height automatically
            height: 26,
            items: [{
                itemId: 'logo',
                text: '<b>BioMart</b> &sdot; Biological queries made easy',
                iconCls: 'biomart_icon',
                cls: 'x-btn-text-icon',
                handler: function () {
                    Ext.MessageBox.alert(Martview.APP_TITLE, 'About BioMart');
                }
            },
            '->', {
                itemId: 'login',
                text: 'Login',
                iconCls: 'user_icon',
                cls: 'x-btn-text-icon'
            },
            '-', {
                itemId: 'help',
                text: 'Help',
                iconCls: 'help_icon',
                cls: 'x-btn-text-icon'
            }]

        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Martview.Header.superclass.initComponent.apply(this, arguments);
    }

});

Ext.reg('header', Martview.Header);

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
