Ext.namespace('Martview');

Martview.Footer = Ext.extend(Ext.Toolbar, {

  // soft config
  has_error_message: false,

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
        text: '',
        iconCls: '',
        cls: 'x-btn-text-icon',
        hidden: true
        // tooltip: 'Press this button to get more help on how to use BioMart'
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

  clearMessage: function () {
    var footer = this;
    footer.messageButton.hide();
    footer.doLayout();
  },

  updateMessage: function (type, message) {
    var footer = this;
    if (type == 'error') {
      footer.has_error_message = true;
    }
    footer.messageButton.setIconClass(type + '-icon');
    footer.messageButton.setText('<span class="' + type + '-msg">' + message + '</span>');
    footer.messageButton.show();
    footer.doLayout();
  },

  updateMessageIfError: function (type, message) {
    var footer = this;
    if (footer.has_error_message) footer.updateMessage(type, message);
  }
});

Ext.reg('footer', Martview.Footer);
