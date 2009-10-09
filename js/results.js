Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

  // hard config
  initComponent: function () {
    var config = {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'fit',
      autoScroll: true,
      border: true,
      title: 'Results',
      tbar: {
        // cls: 'x-panel-header',
        // height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          text: 'Tabular',
          iconCls: 'tabular-results-icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          tooltip: 'Use this menu to select the format of the results panel',
          menu: [{
            text: 'Tabular',
            itemId: 'tabular',
            iconCls: 'tabular-results-icon'
          },
          {
            text: 'Itemized',
            itemId: 'itemized',
            iconCls: 'itemized-results-icon'
          },
          {
            text: 'Chart',
            itemId: 'chart',
            iconCls: 'chart-results-icon'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Add column',
          iconCls: 'add-icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          tooltip: 'Press this button to customize the results grid by adding/removing columns'
        },
        {
          itemId: 'save',
          ref: '../saveButton',
          text: 'Save results',
          iconCls: 'save-icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          tooltip: 'Press this button to save the results in various formats'
        }]
      },
      bbar: [{
        itemId: 'counter',
        ref: '../counterButton',
        text: ''
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Results.superclass.initComponent.apply(this, arguments);
  },

  enableHeaderButtons: function (customize) {
    var results = this;
    results.selectButton.enable();
    if (customize) {
      results.customizeButton.enable();
      results.customizeButton.show();
    } else {
      results.customizeButton.hide();
    }
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
      results.enableHeaderButtons(true);
      var colModel = new Ext.grid.ColumnModel({
        defaults: {
          width: 100,
          sortable: true
        },
        columns: [new Ext.grid.RowNumberer()].concat(data.columns)
      });
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
      results.enableHeaderButtons();
      var tpl = new Ext.XTemplate('<tpl for=".">', '<div class="item-selector {[ xindex % 2 === 0 ? "item-even" : "item-odd" ]}">', '<table class="item">', '<tr class="title">', '<td style="width: 50px; align: right; vertical-align: top;">{pdb_id} <img src="./ico/arrow-000-small.png" style="vertical-align: middle;" /></td><td>{title}</td>', '</tr>', '<tr>', '<td style="width: 50px; align: center; vertical-align: top;"><img style="width: 50px;" src="http://www.rcsb.org/pdb/images/{pdb_id}_asym_r_250.jpg" /></td>', '<td>', '<div class="attribute">Experiment type: {experiment_type}</div>', '<div class="attribute">Resolution: {resolution}</div>', '<div class="attribute">Space group: {space_group}</div>', '<div class="attribute">R work: {r_work}</div></td>', '</tr>', '</table>', '</div>', '</tpl>', '<div class="x-clear"></div>');
      var rows = new Ext.DataView({
        store: store,
        tpl: tpl,
        itemSelector: 'div.item-selector',
        overClass: 'selected-item',
        singleSelect: true,
        border: false,
        autoHeight: true,
        autoWidth: true,
        fitToFrame: true
      });
    } else if (format == 'chart') {
      results.enableHeaderButtons();
      store.filter('chromosome_name', '1');
      var chromosome_1 = store.getCount();
      if (debug) console.log('chromosome_1:' + chromosome_1);
      store.filter('chromosome_name', '2');
      var chromosome_2 = store.getCount();
      store.filter('chromosome_name', '3');
      var chromosome_3 = store.getCount();
      store.filter('chromosome_name', '4');
      var chromosome_4 = store.getCount();
      store.filter('chromosome_name', '5');
      var chromosome_5 = store.getCount();
      store.filter('chromosome_name', '6');
      var chromosome_6 = store.getCount();
      store.filter('chromosome_name', '7');
      var chromosome_7 = store.getCount();
      store.filter('chromosome_name', '8');
      var chromosome_8 = store.getCount();
      store.filter('chromosome_name', '9');
      var chromosome_9 = store.getCount();
      store.filter('chromosome_name', '10');
      var chromosome_10 = store.getCount();
      store.filter('chromosome_name', '11');
      var chromosome_11 = store.getCount();
      store.filter('chromosome_name', '12');
      var chromosome_12 = store.getCount();
      store.filter('chromosome_name', '13');
      var chromosome_13 = store.getCount();
      store.filter('chromosome_name', '14');
      var chromosome_14 = store.getCount();
      store.filter('chromosome_name', '15');
      var chromosome_15 = store.getCount();
      store.filter('chromosome_name', '16');
      var chromosome_16 = store.getCount();
      store.filter('chromosome_name', '17');
      var chromosome_17 = store.getCount();
      store.filter('chromosome_name', '18');
      var chromosome_18 = store.getCount();
      store.filter('chromosome_name', '19');
      var chromosome_19 = store.getCount();
      store.filter('chromosome_name', '20');
      var chromosome_20 = store.getCount();
      store.filter('chromosome_name', '21');
      var chromosome_21 = store.getCount();
      store.filter('chromosome_name', '22');
      var chromosome_22 = store.getCount();
      store.filter('chromosome_name', 'X');
      var chromosome_X = store.getCount();
      store.filter('chromosome_name', 'Y');
      var chromosome_Y = store.getCount();

      var chart_store = new Ext.data.JsonStore({
        fields: ['category', 'data'],
        data: [{
          category: '1',
          data: chromosome_1
        },
        {
          category: '2',
          data: chromosome_2
        },
        {
          category: '3',
          data: chromosome_3
        },
        {
          category: '4',
          data: chromosome_4
        },
        {
          category: '5',
          data: chromosome_5
        },
        {
          category: '6',
          data: chromosome_6
        },
        {
          category: '7',
          data: chromosome_7
        },
        {
          category: '8',
          data: chromosome_8
        },
        {
          category: '9',
          data: chromosome_9
        },
        {
          category: '10',
          data: chromosome_10
        },
        {
          category: '11',
          data: chromosome_11
        },
        {
          category: '12',
          data: chromosome_12
        },
        {
          category: '13',
          data: chromosome_13
        },
        {
          category: '14',
          data: chromosome_14
        },
        {
          category: '15',
          data: chromosome_15
        },
        {
          category: '16',
          data: chromosome_16
        },
        {
          category: '17',
          data: chromosome_17
        },
        {
          category: '18',
          data: chromosome_18
        },
        {
          category: '19',
          data: chromosome_19
        },
        {
          category: '20',
          data: chromosome_20
        },
        {
          category: '21',
          data: chromosome_21
        },
        {
          category: '22',
          data: chromosome_22
        },
        {
          category: 'X',
          data: chromosome_X
        },
        {
          category: 'Y',
          data: chromosome_Y
        }]
      });
      var rows = new Ext.chart.ColumnChart({
        store: chart_store,
        yField: 'data',
        xField: 'category'
      });
    }
    results.removeAll();
    results.add(rows);
    results.doLayout();
  }
});

Ext.reg('results', Martview.Results);
