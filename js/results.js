Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {
  initComponent: function () {
    Ext.applyIf(this, {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'fit',
      //       title: 'Results',
      //       tools: [{
      //         id: 'gear',
      //         qtip: 'Customize the results panel'
      //       },
      //       {
      //         id: 'save',
      //         qtip: 'Save the results'
      //       }],
      tbar: new Ext.Toolbar({
        cls: 'x-panel-header',
        height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          text: '<span style="color:#15428B; font-weight:bold">Results</span>',
          iconCls: 'results_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          menu: [{
            text: 'Tabular',
            iconCls: 'tabular_view_icon',
            checked: true,
            group: 'view'
          },
          {
            text: 'Itemized',
            iconCls: 'itemized_view_icon',
            group: 'view'
          },
          {
            text: 'Map',
            iconCls: 'map_view_icon',
            group: 'view'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Add column',
          iconCls: 'add_icon',
          cls: 'x-btn-text-icon',
          disabled: true
        },
        {
          itemId: 'save',
          ref: '../saveButton',
          text: 'Save',
          iconCls: 'save_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          handler: function () {
            Ext.MessageBox.alert(Martview.APP_TITLE, 'Save results in various formats');
          }
        }]
      }),
      bbar: [{
        itemId: 'counter',
        ref: '../counterButton'
      }]
    });

    // call parent
    Martview.Results.superclass.initComponent.apply(this, arguments);
  },

  enableHeaderButtons: function () {
    var results = this;
    results.selectButton.enable();
    results.customizeButton.enable();
    results.saveButton.enable();
  },

  updateCounter: function (message) {
    var results = this;
    results.counterButton.setText(message);
  },

  load: function (store, colModel) {
    var results = this;
    var grid = new Ext.grid.GridPanel({
      store: store,
      colModel: colModel,
      enableColumnHide: false,
      enableHdMenu: false,
      disableSelection: true,
      stripeRows: true,
      // autoExpandColumn: 'gene_name',
      border: false
    });
    results.removeAll();
    results.add(grid);
    results.doLayout();
  }
});

Ext.reg('results', Martview.Results);
