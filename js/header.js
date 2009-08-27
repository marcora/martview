Ext.namespace('Martview');

Martview.Header = Ext.extend(Ext.Toolbar, {
  initComponent: function () {
    Ext.applyIf(this, {
      region: 'north',
      id: 'header',
      ref: '../header',
      // FIX: should adjust height automatically
      height: 26,
      items: [{
        itemId: 'select',
        ref: 'selectButton',
        text: document.title,
        iconCls: 'favicon_icon',
        cls: 'x-btn-text-icon',
        hidden: false,
        menu: []
      },
      {
        itemId: 'select_sep',
        ref: 'selectSeparator',
        text: '&lArr;',
        hidden: false
      },
      {
        itemId: 'tip',
        ref: 'tipButton',
        text: 'Select database to search',
        iconCls: 'dataset_icon',
        cls: 'x-btn-text-icon',
        hidden: false
      },
      {
        itemId: 'mart',
        ref: 'martButton',
        text: '{{mart}}',
        cls: 'x-btn-text-icon',
        iconCls: 'mart_icon',
        hidden: true
      },
      {
        itemId: 'mart_sep',
        ref: 'martSeparator',
        text: '&gt;',
        hidden: true
      },
      {
        itemId: 'dataset',
        ref: 'datasetButton',
        text: '{{dataset}}',
        cls: 'x-btn-text-icon',
        iconCls: 'dataset_icon',
        hidden: true
      },
      '->', {
        itemId: 'login',
        ref: 'loginButton',
        text: 'Login',
        iconCls: 'user_icon',
        cls: 'x-btn-text-icon',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Login');
        }
      },
      {
        itemId: 'help',
        ref: 'HelpButton',
        text: 'Help',
        iconCls: 'help_icon',
        cls: 'x-btn-text-icon',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Help');
        }
      }]

    });

    // call parent
    Martview.Header.superclass.initComponent.apply(this, arguments);
  },

  updateBreadcrumbs: function (params) {
    header = this;
    header.tipButton.hide();
    header.selectSeparator.setText('>');
    header.martButton.setText(params.mart_display_name || params.mart_name).show();
    header.martSeparator.show();
    header.datasetButton.setText(params.dataset_display_name || params.dataset_name).show();
  }

});

Ext.reg('header', Martview.Header);
