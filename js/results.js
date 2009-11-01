Ext.ns('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

  // hard config
  initComponent: function() {
    var config = {
      id: 'results',
      ref: '../results',
      region: 'center',
      layout: 'fit',
      title: 'Results',
      border: true,
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
          tooltip: 'Use this menu to select the results format',
          menu: {
            items: [{
              text: 'Tabular',
              itemId: 'tabular',
              iconCls: 'tabular-results-icon',
              tooltip: 'A table-like display format for results'

            },
            {
              text: 'Itemized',
              itemId: 'itemized',
              iconCls: 'itemized-results-icon',
              tooltip: 'A Google-like display format for results'
            },
            {
              text: 'Mapped',
              itemId: 'mapped',
              iconCls: 'mapped-results-icon',
              tooltip: 'A mapped display format for results'
            },
            {
              text: 'Aggregated',
              itemId: 'aggregated',
              iconCls: 'aggregated-results-icon',
              tooltip: 'An aggregated display format for results'
            }],
            listeners: {
              'itemclick': {
                fn: function(item) {
                  var results = this;
                  var args = {
                    results: item.getItemId()
                  };
                  results.select(args);
                },
                scope: this // results
              }
            }
          }
        },
        '-', {
          itemId: 'customize',
          ref: '../customizeButton',
          cls: 'x-btn-text-icon',
          text: 'Add column',
          iconCls: 'add-icon',
          disabled: true,
          tooltip: 'Press this button to customize the results grid by adding/removing columns',
          handler: function() {
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
          handler: function() {
            var results = this;
            results.save();
          },
          scope: this // results
        }]
      },
      bbar: [{
        xtype: 'tbtext',
        itemId: 'counter',
        ref: '../counter',
        text: '&nbsp;'
      },
      {
        text: '&nbsp;',
        disabled: true
      }],
      autoDestroy: true,
      defaults: {
        border: false,
        autoDestroy: true
        // autoWidth: true,
        // autoHeight: true,
        // fitToFrame: true
      },
      items: []
    };

    // add custom events
    this.addEvents('select', 'customize', 'save');

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Results.superclass.initComponent.apply(this, arguments);
  },

  select: function(args) {
    var results = this;
    results.fireEvent('select', args);
  },

  customize: function() {
    var results = this;
    results.fireEvent('customize');
  },

  save: function() {
    var results = this;
    results.fireEvent('save');
  },

  update: function(args) {
    var results = this;

    // destructive update
    // enable buttons
    results.selectButton.enable();
    results.selectButton.setIconClass(args.results + '-results-icon');
    results.selectButton.setText(args.results.charAt(0).toUpperCase() + args.results.slice(1));
    results.customizeButton.disable().hide();
    results.saveButton.enable();

    if (args.results == 'tabular') {
      results.customizeButton.enable().show();
    } else if (args.results == 'itemized') {
      // pass
    } else if (args.results == 'mapped') {
      // pass
    } else if (args.results == 'aggregated') {
      // pass
    }

    // update results panel
    results.removeAll();
    results.add({
      xtype: args.results + 'results',
      itemId: args.results,
      ref: args.results,
      fields: args.fields,
      columns: args.columns
    });

    // refresh results panel
    results.doLayout();

    // load rows
    results.items.first().load(args);
  },

  clear: function() {
    var results = this;
    delete results.current;
    results.removeAll();
    results.selectButton.disable();
    results.customizeButton.disable();
    results.saveButton.disable();
    results.counter.setText('&nbsp;');
    results.doLayout();
  }
});

Ext.reg('results', Martview.Results);
