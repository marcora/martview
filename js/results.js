Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

  initComponent: function () {

    Ext.applyIf(this, {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'fit',
      iconCls: 'results_icon',
      //       title: 'Results',
      //       tools: [{
      //         id: 'gear',
      //         qtip: 'Customize the results panel'
      //       },
      //       {
      //         id: 'save',
      //         qtip: 'Save the results'
      //       }],
      bbar: [{
        itemId: 'counter',
        ref: '../counterButton'
      }],
      tbar: new Ext.Toolbar({
        cls: 'x-panel-header',
        height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          text: '<span style="color:#15428B; font-weight:bold">Results</span>',
          iconCls: 'results_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          menu: [{
            text: 'Tabular',
            iconCls: 'tabular_view_icon',
            checked: true,
            group: 'view'
          },
          {
            text: 'Itemized',
            iconCls: 'itemized_view_icon',
            group: 'view'
          },
          {
            text: 'Map',
            iconCls: 'map_view_icon',
            group: 'view'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Customize',
          iconCls: 'edit_icon',
          cls: 'x-btn-text-icon',
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
      })
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

  updateCounter: function (message) {
    var results = this;
    results.counterButton.setText(message);
  },

  load: function (query) {
    var results = this;
    var store = query.getJsonStore();
    var colModel = query.getColModel();
    var url = 'http://martservice.biomart.org';
    Ext.ux.JSONP.request(url, {
      callbackKey: 'callback',
      params: {
        type: 'query',
        xml: query.getXml()
      },
      callback: function (data) {
        if (data) {
          store.loadData(data);
          var grid = new Ext.grid.GridPanel({
            store: store,
            colModel: colModel,
            enableColumnHide: false,
            enableHdMenu: false,
            disableSelection: true,
            stripeRows: true,
            // autoExpandColumn: 'gene_name',
            border: false
          });
          // FIXME: is this the best way to do it?
          results.removeAll();
          results.add(grid);
          results.doLayout();
        }
        else {
          Ext.Msg.alert(Martview.APP_TITLE, 'Unable to connect to the BioMart service.');
        }
      }
    });
  }
});

Ext.reg('results', Martview.Results);
