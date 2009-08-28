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
        itemId: 'home',
        ref: 'homeButton',
        text: document.title,
        iconCls: 'favicon_icon',
        cls: 'x-btn-text-icon',
        hidden: false,
        handler: function () {
          window.location.search = '';
        }
      },
      {
        itemId: 'home_sep',
        ref: 'homeSeparator',
        text: '>',
        hidden: true
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
        text: '>',
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
      {
        itemId: 'dataset_sep',
        ref: 'datasetSeparator',
        text: '>',
        hidden: true
      },
      {
        itemId: 'search',
        ref: 'searchButton',
        text: '{{search}}',
        cls: 'x-btn-text-icon',
        iconCls: 'search_icon',
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
    header.homeSeparator.show();
    header.martButton.setText(params.mart_display_name || params.mart_name).show();
    header.martSeparator.show();
    header.datasetButton.setText(params.dataset_display_name || params.dataset_name).show();
    header.datasetSeparator.show();
    header.searchButton.setIconClass(params.search_name + '_search_icon');
    header.searchButton.setText(params.search_display_name || params.search_name).show();
  }

});

Ext.reg('header', Martview.Header);
