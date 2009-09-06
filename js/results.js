Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {
  initComponent: function () {
    Ext.applyIf(this, {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'fit',
      autoScroll: true,
      border: true,
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
            iconCls: 'tabular_results_icon'
          },
          {
            text: 'Itemized',
            itemId: 'itemized',
            iconCls: 'itemized_results_icon'
          },
          {
            text: 'Map',
            itemId: 'map',
            iconCls: 'map_results_icon'
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
          text: 'Save results',
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
        ref: '../counterButton',
        text: ''
      }],
      items: [{
        border: false
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

  disableHeaderButtons: function () {
    var results = this;
    results.selectButton.disable();
    results.customizeButton.disable();
    results.saveButton.disable();
  },

  clear: function () {
    try {
      this.items.first().getStore().removeAll();
      this.disableHeaderButtons();
      this.counterButton.setText('');
      return true;
    } catch(e) {
      return false;
    }
  },

  load: function (data, format) {
    var results = this;

    var store = new Ext.data.JsonStore({
      autoDestroy: true,
      root: 'rows',
      idProperty: name,
      fields: data.fields
    });
    store.loadData(data);

    results.counterButton.setText(store.getTotalCount() + ' of ' + data.count);

    if (format == 'tabular') {
      var colModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer()].concat(data.columns));
      var rows = new Ext.grid.GridPanel({
        store: store,
        colModel: colModel,
        enableColumnHide: false,
        enableHdMenu: false,
        disableSelection: true,
        stripeRows: true,
        // autoExpandColumn: 'col',
        border: false
      });
    } else if (format == 'itemized') {
      var tpl = new Ext.XTemplate('<tpl for=".">', '<div class="item-selector"><table class="item" style="margin-bottom: 5px;">', '<tr class="title">', '<td style="width: 50px; align: right; vertical-align: top;">{pdb_id} <img src="./ico/arrow-000-small.png" style="vertical-align: middle;" /></td><td>{title}</td>', '</tr>', '<tr>', '<td style="width: 50px; align: center; vertical-align: top;"><img style="width: 50px;" src="http://www.rcsb.org/pdb/images/{pdb_id}_asym_r_250.jpg" /></td>', '<td>', '<div class="attribute">Experiment type: {experiment_type}</div>', '<div class="attribute">Resolution: {resolution}</div>', '<div class="attribute">Space group: {space_group}</div>', '<div class="attribute">R work: {r_work}</div>', '</td>', '</tr>', '</table></div>', '</tpl>', '<div class="x-clear"></div>');
      var rows = new Ext.DataView({
        store: store,
        tpl: tpl,
        autoHeight: true,
        itemSelector: 'div.item-selector',
        overClass: 'selected-item',
        singleSelect: true,
        border: false
      });
    }
    results.removeAll();
    results.add(rows);
    results.doLayout();
  }
});

Ext.reg('results', Martview.Results);
