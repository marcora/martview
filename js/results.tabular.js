Ext.namespace('Martview.results');

Martview.results.Tabular = Ext.extend(Ext.grid.GridPanel, {

  // hard config
  initComponent: function () {
    var config = {
      enableColumnHide: false,
      enableHdMenu: false,
      disableSelection: true,
      stripeRows: true,
      border: false,
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        root: 'rows'
        // fields: params.results.fields
      }),
      colModel: new Ext.grid.ColumnModel({
        defaults: {
          width: 100,
          sortable: true
        },
        // columns: [new Ext.grid.RowNumberer()].concat(params.results.columns)
      })
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.results.Tabular.superclass.initComponent.apply(this, arguments);
  },

  update: function (params) {
    var results = this;
    var store = results.getStore();
    store.loadData(params.results);
    results.counterButton.setText(store.getTotalCount() + ' of ' + params.results.count);
  },

  reset: function () {
    var results = this;
    // TODO
  }
});

Ext.reg('tabularresults', Martview.results.Tabular);
