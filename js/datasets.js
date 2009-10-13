Ext.namespace('Martview');

Martview.Datasets = Ext.extend(Ext.Panel, {

  // soft config
  height: 400,
  width: 800,
  iconCls: 'no-icon',
  border: false,

  // hard config
  initComponent: function () {
    var config = {
      id: 'datasets',
      layout: 'vbox',
      buttonAlign: 'center',
      buttons: [{
        text: 'Cancel',
        iconCls: 'reset-icon',
        handler: function () {
          this.ownerCt.ownerCt.ownerCt.hide();
        }
      },
      {
        text: 'Select',
        iconCls: 'submit-icon'
      }],
      items: [{
        xtype: 'form',
        border: false,
        width: '100%',
        hideLabels: true,
        items: [{
          xtype: 'searchfield',
          anchor: '100%'
        }]
      },
      {
        xtype: 'grid',
        // border: false,
        width: '100%',
        flex: 1,
        hideHeaders: true,
        // autoHeight: true,
        // autoWidth: true,
        // fitToFrame: true,
        // singleSelect: true,
        enableHdMenu: false,
        stripeRows: true,
        sm: new Ext.grid.RowSelectionModel({
          singleSelect: true
        }),
        store: new Ext.data.JsonStore({
          url: './json/datasets.json',
          root: 'rows',
          autoLoad: true,
          autoDestroy: true,
          fields: ['mart_display_name', 'dataset_display_name', 'description', 'keywords']
        }),
        // view: new Ext.ux.grid.BufferView({
        //   // // custom row height
        //   // rowHeight: 10,
        //   forceFit: true,
        //   scrollOffset: 1,
        //   emptyText: 'There are no datasets to select',
        //   // render rows as they come into viewable area.
        //   scrollDelay: false
        // }),
        viewConfig: {
          forceFit: true
        },
        colModel: new Ext.grid.ColumnModel({
          columns: [{
            id: 'dataset',
            header: "Dataset",
            dataIndex: 'dataset_display_name',
            renderer: function (value, p, record) {
              return String.format('<h2 style="color: #333 !important; font-size: 1.4em !important;">{0} <span style="font-weight: normal !important; color: #888 !important;">[{1}]</span></h2><p style="font-size: 1.2em !important; color: #444 !important;">{2}</p><p style="color: #888 !important;">{3}</p>', value, record.data.mart_display_name, record.data.description, record.data.keywords);
            },
            sortable: false
          }]
        })
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Datasets.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('datasets', Martview.Datasets);
