Ext.namespace('Martview');

Martview.Footer = Ext.extend(Ext.Toolbar, {

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
        text: '',
        iconCls: '',
        cls: 'x-btn-text-icon',
        hidden: true
      },
      '->', {
        itemId: 'biomart',
        ref: 'biomartButton',
        text: 'Powered by BioMart &sdot; Biological queries made easy',
        iconCls: 'biomart_icon',
        cls: 'x-btn-text-icon',
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

  clearMessage: function () {
    var footer = this;
    footer.messageButton.hide();
    footer.doLayout();
  },

  updateMessage: function (type, message) {
    var footer = this;
    footer.messageButton.setIconClass(type + '_icon');
    footer.messageButton.setText('<span class="' + type + '-msg">' + message + '</span>');
    footer.messageButton.show();
    footer.doLayout();
  }
});

Ext.reg('footer', Martview.Footer);
