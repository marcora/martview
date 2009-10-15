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
        text: 'Choose dataset',
        cls: 'x-btn-text-icon',
        iconCls: 'selectdb-icon'
      },
      {
        itemId: 'sep',
        ref: 'separator',
        cls: 'x-btn-text', // cls: 'x-btn-text-icon',
          text: '>', // &rArr;', // iconCls: 'rarrow-icon',
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

  update: function (params) {
    var header = this;
    header.separator.show();
    header.datasetButton.setText('<span style="color: #333; font-weight: bold;">'+ (params.dataset_display_name || params.dataset_name) +'</span>&nbsp;<span style="color: #666;">['+ (params.mart_display_name || params.mart_name) + ']</span>').show();
    // update document title to match breadcrumbs
    document.title = (params.dataset_display_name || params.dataset_name) + ' [' + (params.mart_display_name || params.mart_name) + ']';
  }

});

Ext.reg('header', Martview.Header);
