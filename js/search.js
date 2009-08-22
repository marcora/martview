Ext.namespace('Martview');

Martview.Search = Ext.extend(Ext.Panel, {
  initComponent: function () {
    Ext.applyIf(this, {
      id: 'search',
      ref: '../search',
      region: 'west',
      layout: 'fit',
      width: 500,
      split: true,
      collapsible: true,
      collapseMode: 'mini',
      hideCollapseTool: true,
      bodyStyle: 'background-color:#dfe8f6;',
      //       title: 'Search',
      //       tools: [{
      //         id: 'gear',
      //         qtip: 'Customize the search panel'
      //       },
      //       {
      //         id: 'save',
      //         qtip: 'Save the search'
      //       }],
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
          text: 'Add filter',
          iconCls: 'add_icon',
          cls: 'x-btn-text-icon',
          hidden: true
        },
        {
          text: 'Save',
          itemId: 'save',
          ref: '../saveButton',
          iconCls: 'save_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
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
        disabled: true,
        handler: function () {
          this.items.first().getForm().reset(); // FIXME: should be this.form!
        },
        scope: this // search panel scope
      },
      {
        itemId: 'submit',
        ref: '../submitButton',
        text: 'Submit',
        iconCls: 'submit_icon',
        cls: 'x-btn-text-icon',
        disabled: true
      }],
      items: [{
        xtype: 'form',
        itemId: 'form',
        ref: '../form',
        border: false,
        padding: 10,
        labelAlign: 'top',
        autoScroll: true,
        bodyStyle: 'background-color:#dfe8f6;'
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
