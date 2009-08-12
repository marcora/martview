Ext.namespace('Martview');

Martview.Search = Ext.extend(Ext.form.FormPanel, {
  initComponent: function () {
    Ext.applyIf(this, {
      region: 'west',
      id: 'search',
      ref: '../search',
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
      labelAlign: 'top',
      bodyStyle: 'background-color:#dfe8f6;',
      tbar: new Ext.Toolbar({
        cls: 'x-panel-header',
        height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          text: '<span style="color:#15428B; font-weight:bold">Search</span>',
          iconCls: 'search_icon',
          cls: 'x-btn-text-icon',
          disabled: false,
          menu: []
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Customize',
          iconCls: 'edit_icon',
          cls: 'x-btn-text-icon',
          disabled: true
        },
        {
          text: 'Save',
          itemId: 'save',
          ref: '../saveButton',
          disabled: true,
          iconCls: 'save_icon',
          cls: 'x-btn-text-icon',
          handler: function () {
            Ext.MessageBox.alert(Martview.APP_TITLE, 'Save search in various formats');
          }
        }]
      }),
      bbar: ['->', {
        itemId: 'reset',
        ref: '../resetButton',
        text: 'Reset',
        iconCls: 'reset_icon',
        cls: 'x-btn-text-icon',
        disabled: true
      },
      {
        itemId: 'submit',
        ref: '../submitButton',
        text: 'Submit',
        iconCls: 'submit_icon',
        cls: 'x-btn-text-icon',
        disabled: true
      }]
    });

    // call parent
    Martview.Search.superclass.initComponent.apply(this, arguments);
  },

  enableHeaderButtons: function () {
    var search = this;
    search.customizeButton.enable();
    search.saveButton.enable();
  },

  disableHeaderButtons: function () {
    var search = this;
    search.customizeButton.disable();
    search.saveButton.disable();
  },

  enableFormButtons: function () {
    var search = this;
    search.resetButton.enable();
    search.submitButton.enable();
  },

  disableFormButtons: function () {
    var search = this;
    search.resetButton.disable();
    search.submitButton.disable();
  }

});

Ext.reg('search', Martview.Search);
