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
        menu: []
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
        text: 'Select the database to search',
        cls: 'x-btn-text-icon',
        iconCls: 'larrow_icon',
        hidden: false
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
        text: 'dataset_name',
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
    header.homeButton.addClass('no-menu-arrow');
    header.homeSeparator.show();
    header.martButton.setIconClass('mart_icon').setText(params.mart_display_name || params.mart_name).show();
    header.martSeparator.show();
    header.datasetButton.setText(params.dataset_display_name || params.dataset_name).show();
  }

});

Ext.reg('header', Martview.Header);
