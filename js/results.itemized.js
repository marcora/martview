Ext.namespace('Martview.results');

Martview.results.Itemized = Ext.extend(Ext.grid.GridPanel, {

  //     var rows = new Ext.grid.GridPanel({
  //       store: store,
  //       colModel: colModel,
  //     });
  // hard config
  initComponent: function () {
    var config = {
      cls: 'itemized',
      hideHeaders: true,
      enableColumnHide: false,
      enableHdMenu: false,
      disableSelection: true,
      stripeRows: true,
      border: false,
      viewConfig: {
        forceFit: true,
        enableRowBody: true
      },
      store: new Ext.data.JsonStore({
        autoDestroy: true,
        root: 'rows'
        // fields: params.results.fields
      }),
      colModel: new Ext.grid.ColumnModel({
        columns: [{
          xtype: 'templatecolumn',
          id: 'item',
          sortable: false,
          tpl: new Ext.XTemplate( //
          '<tpl for=".">', //
          '<table style="width: 100%;">', //
          '<tr>', //
          '<td style="width: 50px; align: right; vertical-align: top; font-weight: bold; color: #333;">', //
          '{pdb_id}<img src="./ico/arrow-000-small.png" style="vertical-align: middle;" />', //
          '</td>', //
          '<td style="font-weight: bold; color: #333;">', //
          '{title}', //
          '</td>', //
          '</tr>', //
          '<tr>', //
          '<td style="width: 50px; align: center; vertical-align: top;">', //
          '<img style="width: 50px;" src="http://www.rcsb.org/pdb/images/{pdb_id}_asym_r_250.jpg" />', //
          '</td>', //
          '<td>', //
          '<div style="color: #666;">Experiment type: {experiment_type}</div>', //
          '<div style="color: #666;">Resolution: {resolution}</div>', //
          '<div style="color: #666;">Space group: {space_group}</div>', //
          '<div style="color: #666;">R work: {r_work}</div>', //
          '</td>', //
          '</tr>', //
          '</table>', //
          '</tpl>' //
          )
        }]
      })
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.results.Itemized.superclass.initComponent.apply(this, arguments);
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

Ext.reg('itemizedresults', Martview.results.Itemized);
