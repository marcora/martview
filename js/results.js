Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

  // hard config
  initComponent: function () {
    var config = {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'card',
      autoScroll: true,
      border: true,
      title: 'Results',
      tbar: {
        // cls: 'x-panel-header',
        // height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          cls: 'x-btn-text-icon',
          text: 'Tabular',
          iconCls: 'tabular-results-icon',
          disabled: true,
          tooltip: 'Use this menu to select the format of the results panel',
          menu: {
            items: [{
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
              text: 'Mapped',
              itemId: 'mapped',
              iconCls: 'mapped-results-icon'
            },
            {
              text: 'Aggregated',
              itemId: 'aggregated',
              iconCls: 'aggregated-results-icon'
            }],
            listeners: {
              'itemclick': {
                fn: function (item) {
                  var results = this;
                  var params = {
                    results: item.getItemId()
                  };
                  results.select(params);
                },
                scope: this // results
              }
            }
          }
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          cls: 'x-btn-text-icon',
          text: 'Add column',
          iconCls: 'add-icon',
          disabled: true,
          tooltip: 'Press this button to customize the results grid by adding/removing columns',
          handler: function () {
            var results = this;
            results.customize();
          },
          scope: this // results
        },
        {
          itemId: 'save',
          ref: '../saveButton',
          cls: 'x-btn-text-icon',
          text: 'Save results',
          iconCls: 'save-icon',
          disabled: true,
          tooltip: 'Press this button to save the results in various formats',
          handler: function () {
            var results = this;
            results.save();
          },
          scope: this // results
        }]
      },
      bbar: [{
        itemId: 'counter',
        ref: '../counterButton',
        cls: 'x-btn-text',
        text: ''
      }],
      activeItem: 0,
      defaults: {
        border: false,
        autoWidth: true,
        autoHeight: true,
        fitToFrame: true
      },
      items: [{
        itemId: 'clear',
        ref: 'clear'
      },
      {
        xtype: 'tabularresults',
        itemId: 'tabular',
        ref: 'tabular'
      },
      {
        xtype: 'itemizedresults',
        itemId: 'itemized',
        ref: 'itemized'
      },
      {
        xtype: 'mappedresults',
        itemId: 'mapped',
        ref: 'mapped'
      },
      {
        xtype: 'aggregatedresults',
        itemId: 'aggregated',
        ref: 'aggregated'
      }]
    };

    // add custom events
    this.addEvents('select', 'update', 'clear', 'customize', 'save');

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Results.superclass.initComponent.apply(this, arguments);
  },

  select: function (params) {
    var results = this;
    results.selectButton.enable();
    results.selectButton.setIconClass(params.results + '-results-icon');
    results.selectButton.setText(params.results.charAt(0).toUpperCase() + params.results.slice(1));
    results.customizeButton.disable().hide();
    results.saveButton.enable();
    if (params.results == 'tabular') {
      results.customizeButton.enable().show();
    } else if (params.results == 'itemized') {
      // pass
    } else if (params.results == 'mapped') {
      // pass
    } else if (params.results == 'aggregated') {
      // pass
    }
    results.layout.setActiveItem(params.results);
    results.fireEvent('select', params);
  },

  update: function (params) {
    var results = this;
    results.layout.activeItem.update(params);
    results.fireEvent('update', params);
  },

  clear: function () {
    var results = this;
    results.layout.activeItem.clear();
    results.fireEvent('clear');
  },

  customize: function () {
    var results = this;
    results.fireEvent('customize');
  },

  save: function () {
    var results = this;
    results.fireEvent('save');
  }
});

Ext.reg('results', Martview.Results);
