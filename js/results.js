Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      id: 'results',
      region: 'center',
      layout: 'fit',
      iconCls: 'results_icon',
      title: 'Results',
      tools: [{
        id: 'print',
        qtip: 'Print the results'
      },
      {
        id: 'save',
        qtip: 'Export the results in various formats'
      }],
      bbar: [{
        itemId: 'count'
      }],
      tbar: [{
        text: 'Select view',
        id: 'selectview',
        iconCls: 'view_icon',
        cls: 'x-btn-text-icon',
        disabled: true,
        menu: [{
          text: 'Tabular',
          iconCls: 'tabular_view_icon'
        },
        {
          text: 'Itemized',
          iconCls: 'itemized_view_icon'
        },
        {
          text: 'Map',
          iconCls: 'map_view_icon'
        }]
      },
      '-', {
        text: 'Customize view',
        itemId: 'customize',
        disabled: true,
        iconCls: 'edit_icon',
        cls: 'x-btn-text-icon'
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Results.superclass.initComponent.apply(this, arguments);

  },

  clearView: function () {
    this.items.first().getTopToolbar().items.each(function (item, index) {
      item.disable();
    });
  },

  selectView: function (params) {
    this.items.first().getTopToolbar().items.each(function (item, index) {
      item.enable();
    });
  }

  //     simplifyUI: function () {
  //         this.getTopToolbar().items.each(function (item) {
  //             if (!(item.getItemId() in {'save':''})) item.destroy();
  //         });
  //     }
});

Ext.reg('results', Martview.Results);
