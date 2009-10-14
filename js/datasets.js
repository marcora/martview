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
        bodyStyle: 'background-color: #f0f0f0;',
        border: false,
        width: '100%',
        hideLabels: true,
        items: [{
          xtype: 'searchfield',
          anchor: '100%',
          emptyText: 'Find a dataset'
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
            xtype: 'templatecolumn',
            id: 'dataset',
            header: "Dataset",
            dataIndex: 'dataset_display_name',
            tpl: new Ext.XTemplate('<tpl for="."><h2 style="color: #333 !important; font-size: 1.4em !important;">{dataset_display_name} <span style="font-weight: normal !important; color: #888 !important;">[{mart_display_name}]</span></h2><p style="font-size: 1.2em !important; color: #444 !important;">{description}</p><p style="margin-top: 4px !important; margin-bottom: 4px !important;"><tpl for="keywords"><span style="background-color: #9cbfee; color: #fff; -moz-border-radius: 4px; -webkit-border-radius: 4px; padding: 2px; font-size: 0.9em; font-weight: bold;">{.}</span>&nbsp;</tpl></p></tpl>'),
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
