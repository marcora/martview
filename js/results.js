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
          iconCls: 'tabular_results_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          menu: [{
            text: 'Tabular',
            itemId: 'tabular',
            iconCls: 'tabular_results_icon',
            checked: true,
            group: 'formt'
          },
          {
            text: 'Itemized',
            itemId: 'itemized',
            iconCls: 'itemized_results_icon',
            group: 'format'
          },
          {
            text: 'Map',
            itemId: 'map',
            iconCls: 'map_results_icon',
            group: 'format'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Add column',
          iconCls: 'add_icon',
          cls: 'x-btn-text-icon',
          hidden: true,
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

  load: function (data) {
    var results = this;

    var store = new Ext.data.JsonStore({
      autoDestroy: true,
      root: 'rows',
      idProperty: name,
      fields: data.fields
    });
    store.loadData(data);
    var colModel = new Ext.grid.ColumnModel(data.columns);
    results.updateCounter(store.getTotalCount() + ' of ' + data.count);

    var rows = new Ext.grid.GridPanel({
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
    results.add(rows);
    results.doLayout();
  }
});

Ext.reg('results', Martview.Results);
