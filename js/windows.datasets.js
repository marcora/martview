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
            emptyText: 'Enter search terms (for example, human genes or protein structures or uniprot) to find a specific dataset'
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
            sortable: false,
            id: 'dataset',
            header: "Dataset",
            tpl: new Ext.XTemplate('<tpl for=".">',
                                   '<div class="dataset">',
                                   '<h2 class="title">',
                                   '{dataset_display_name}&nbsp;',
                                   '<span class="source">',
                                   '[{mart_display_name}]',
                                   '</span>',
                                   '</h2>',
                                   '<p class="description">',
                                   '{description}',
                                   '</p>',
                                   '<p class="keywords">',
                                   '<tpl for="keywords">',
                                   '<span class="keyword">{.}</span>&nbsp;',
                                   '</tpl>',
                                   '</p>',
                                   '</div>',
                                   '</tpl>')
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
