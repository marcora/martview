Ext.namespace('Martview');

Martview.Search = Ext.extend(Ext.form.FormPanel, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      id: 'search',
      region: 'west',
      split: true,
      collapsible: true,
      collapseMode: 'mini',
      hideCollapseTool: true,
      width: 500,
      iconCls: 'search_icon',
      //       title: 'Search',
      //       tools: [{
      //         id: 'gear',
      //         qtip: 'Customize the search panel'
      //       },
      //       {
      //         id: 'save',
      //         qtip: 'Save the search'
      //       }],
      autoScroll: true,
      padding: 10,
      bodyStyle: 'background-color:#dfe8f6;',
      labelAlign: 'top',
      tbar: new Ext.Toolbar({
        cls: 'x-panel-header',
        height: 26,
        items: [{
          id: 'selectinterface',
          text: '<span style="color:#15428B; font-weight:bold">Search</span>',
          iconCls: 'search_icon',
          cls: 'x-btn-text-icon',
          disabled: false,
          menu: []
        },
        '->', {
          text: 'Customize',
          itemId: 'customize',
          disabled: true,
          iconCls: 'edit_icon',
          cls: 'x-btn-text-icon'
        },
        {
          text: 'Save',
          itemId: 'save',
          disabled: true,
          iconCls: 'save_icon',
          cls: 'x-btn-text-icon',
          handler: function () {
            Ext.MessageBox.alert(Martview.APP_TITLE, 'Save search in various formats');
          }
        }]
      }),
      bbar: ['->', {
        text: 'Reset',
        itemId: 'reset',
        disabled: true,
        iconCls: 'reset_icon',
        cls: 'x-btn-text-icon'
      },
      {
        text: 'Submit',
        itemId: 'submit',
        disabled: true,
        iconCls: 'submit_icon',
        cls: 'x-btn-text-icon'
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Search.superclass.initComponent.apply(this, arguments);

  }

});

Ext.reg('search', Martview.Search);
