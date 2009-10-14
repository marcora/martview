Ext.namespace('Martview');

Martview.Header = Ext.extend(Ext.Toolbar, {

  // hard config
  initComponent: function () {
    var config = {
      region: 'north',
      id: 'header',
      ref: '../header',
      // FIX: should adjust height automatically
      height: 26,
      border: false,
      items: [{
        itemId: 'selectdb',
        ref: 'selectdbButton',
        text: 'Select database',
        cls: 'x-btn-text-icon',
        iconCls: 'selectdb-icon'
      },
      {
        itemId: 'selectdb_sep',
        ref: 'selectdbSeparator',
        cls: 'x-btn-text', // cls: 'x-btn-text-icon',
        text: '&sdot;', // iconCls: 'rarrow-icon',
        hidden: true
      },
      {
        itemId: 'home',
        ref: 'homeButton',
        cls: 'x-btn-text-icon',
        text: 'BioMart',
        iconCls: 'biomart-icon',
        hidden: true
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
        text: 'mart_name',
        cls: 'x-btn-text-icon',
        iconCls: 'mart-icon',
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
        text: 'dataset_name',
        cls: 'x-btn-text-icon',
        iconCls: 'dataset-icon',
        hidden: true
      },
      '->', {
        itemId: 'login',
        ref: 'loginButton',
        text: 'Login',
        iconCls: 'user-icon',
        cls: 'x-btn-text-icon',
        // tooltip: 'Press this button to log into BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Login');
        }
      },
      {
        itemId: 'help',
        ref: 'HelpButton',
        text: 'Help',
        iconCls: 'help-icon',
        cls: 'x-btn-text-icon',
        // tooltip: 'Press this button to get help on how to use BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Help');
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Header.superclass.initComponent.apply(this, arguments);
  },

  updateBreadcrumbs: function (params) {
    var header = this;
    header.selectdbSeparator.show();
    header.homeButton.show();
    header.homeSeparator.show();
    header.martButton.setText(params.mart_display_name || params.mart_name).show();
    header.martSeparator.show();
    header.datasetButton.setText(params.dataset_display_name || params.dataset_name).show();
    // update document title to match breadcrumbs
    document.title = header.homeButton.getText() + ' > ' + params.mart_display_name + ' > ' + params.dataset_display_name;
  }

});

Ext.reg('header', Martview.Header);
