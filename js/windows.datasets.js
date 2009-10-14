Ext.namespace('Martview.windows');

/* ---------------
   Datasets window
   --------------- */
Martview.windows.Datasets = Ext.extend(Ext.Window, {
  // hard config
  initComponent: function () {
    var config = {
      modal: true,
      width: 800,
      height: 500,
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      title: 'Change database',
      iconCls: 'selectdb-icon',
      buttons: [{
        text: 'Cancel',
        cls: 'x-btn-text-icon',
        iconCls: 'reset-icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      },
      {
        text: 'OK',
        cls: 'x-btn-text-icon',
        iconCls: 'submit-icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      }],
      items: [{
        xtype: 'form',
        itemId: 'filter',
        ref: '../filter',
        bodyStyle: 'background-color: #ccd9e8;',
        border: false,
        width: '100%',
        hideLabels: true,
        items: [{
          xtype: 'searchfield',
          anchor: '100%',
          emptyText: 'Find a database'
          // listeners: {
          //   'render': {
          //     fn: function () {
          //       this.focus();
          //     },
          //     delay: 200
          //   }
          // }
        }]
      },
      {
        xtype: 'grid',
        itemId: 'datasets',
        ref: '../datasets',
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
        // view: new Ext.ux.grid.BufferView({
        //   // render rows as they come into viewable area.
        //   scrollDelay: false
        // }),
        sm: new Ext.grid.RowSelectionModel({
          singleSelect: true
        }),
        store: new Ext.data.JsonStore({
          root: 'rows',
          autoDestroy: true,
          fields: ['mart_display_name', 'dataset_display_name', 'description', 'keywords', 'fulltext']
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
    Martview.windows.Datasets.superclass.initComponent.apply(this, arguments);
  },

  load: function (data) {
    this.items.last().getStore().loadData(data);
  }
});
