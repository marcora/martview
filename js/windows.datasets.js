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
      layout: 'fit',
      closeAction: 'hide',
      plain: true,
      autoDestroy: true,
      title: 'Choose dataset',
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
        ref: '../okButton',
        cls: 'x-btn-text-icon',
        iconCls: 'submit-icon'
      }],
      items: [{
        xtype: 'grid',
        title: 'All datasets',
        itemId: 'grid',
        ref: '../grid',
        cls: 'itemized',
        border: false,
        tbar: {
          layout: 'hbox',
          items: [{
            xtype: 'searchfield',
            flex: 1,
            emptyText: 'Enter search terms (for example, human genes) to find a specific dataset'
          }]
        },
        hideHeaders: true,
        // autoHeight: true,
        // autoWidth: true,
        // fitToFrame: true,
        // singleSelect: true,
        enableColumnHide: false,
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
            tpl: new Ext.XTemplate('<tpl for="."><div style="width: 100%;"><h2 style="color: #333; font-size: 1.4em;">{dataset_display_name} <span style="font-weight: normal; color: #888;">[{mart_display_name}]</span></h2><p style="font-size: 1.2em; color: #444; margin-top: 4px;">{description}</p><p style="margin-top: 8px; margin-bottom: 4px;"><tpl for="keywords"><span style="background-color: #9cbfee; color: #fff; -moz-border-radius: 4px; -webkit-border-radius: 4px; padding: 2px; font-size: 1em; font-weight: bold;">{.}</span>&nbsp;</tpl></p></div></tpl>'),
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
    this.items.first().getStore().loadData(data);
  }
});
