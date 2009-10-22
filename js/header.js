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
        itemId: 'select',
        ref: 'selectButton',
        cls: 'x-btn-text-icon',
        text: 'Choose dataset',
        iconCls: 'selectdb-icon',
        tooltip: 'Press this button to choose the dataset you want to search',
        handler: function () {
        var header = this;
          header.select();
        },
        scope: this // header
      },
      {
        itemId: 'sep',
        ref: 'separator',
        cls: 'x-btn-text',
        text: '>',
        hidden: true
      },
      {
        itemId: 'dataset',
        ref: 'datasetButton',
        cls: 'x-btn-text-icon',
        text: '<span class="start">START HERE!</span>',
        iconCls: 'larrow-icon',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'More info about selected dataset');
        }
      },
      '->', {
        itemId: 'login',
        ref: 'loginButton',
        cls: 'x-btn-text-icon',
        text: 'Login',
        iconCls: 'user-icon',
        // tooltip: 'Press this button to log into BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Login');
        }
      },
      {
        itemId: 'help',
        ref: 'HelpButton',
        cls: 'x-btn-text-icon',
        text: 'Help',
        iconCls: 'help-icon',
        // tooltip: 'Press this button to get help on how to use BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Help');
        }
      }]
    };

    // add custom events
    this.addEvents('select');

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Header.superclass.initComponent.apply(this, arguments);
  },

  select: function () {
    var header = this;
    header.fireEvent('select');
  },

  update: function (params) {
    var header = this;
    header.separator.show();
    header.datasetButton.setIconClass(params.iconCls);
    header.datasetButton.setText('<span style="color: #333; font-weight: bold;">' + (params.dataset_display_name || params.dataset_name) + '</span>&nbsp;<span style="color: #666;">[' + (params.mart_display_name || params.mart_name) + ']</span>');
    header.datasetButton.show();
    document.title = (params.dataset_display_name || params.dataset_name) + ' [' + (params.mart_display_name || params.mart_name) + ']';
  },

  clear: function () {
    var header = this;
    header.separator.hide();
    header.datasetButton.hide();
    document.title = '';
  }

});

Ext.reg('header', Martview.Header);
