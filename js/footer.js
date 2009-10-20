Ext.namespace('Martview');

Martview.Footer = Ext.extend(Ext.Toolbar, {

  // hard config
  initComponent: function () {
    var config = {
      region: 'south',
      id: 'footer',
      ref: '../footer',
      // FIX: should adjust height automatically
      height: 26,
      border: false,
      items: [{
        itemId: 'message',
        ref: 'messageButton',
        text: 'To begin, please choose the dataset you want to search',
        iconCls: 'info-icon',
        cls: 'x-btn-text-icon',
        // tooltip: 'Press this button to get more help on how to use BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'More contextual help');
        }
      },
      '->', {
        itemId: 'biomart',
        ref: 'biomartButton',
        text: 'Powered by BioMart &sdot; Biological queries made easy',
        iconCls: 'biomart-icon',
        cls: 'x-btn-text-icon',
        // tooltip: 'Press this button to get information about BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'More about biomart (credits, license, feedback)');
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Footer.superclass.initComponent.apply(this, arguments);
  },

  clear: function () {
    var footer = this;
    footer.messageButton.hide();
  },

  update: function (params) {
    var footer = this;
    footer.messageButton.setIconClass(params.iconCls);
    footer.messageButton.setText(params.text);
    footer.messageButton.show();
  }
});

Ext.reg('footer', Martview.Footer);
