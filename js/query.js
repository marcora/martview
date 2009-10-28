Ext.ns('Martview');

Martview.Query = Ext.extend(Ext.Panel, {

  // hard config
  initComponent: function() {
    var config = {
      id: 'query',
      ref: '../query',
      region: 'west',
      layout: 'fit',
      title: 'Query',
      border: true,
      width: 440,
      split: true,
      bodyStyle: 'background-color:#dfe8f6;',
      tbar: {
        // cls: 'x-panel-header',
        // height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          cls: 'x-btn-text-icon',
          text: 'Advanced',
          iconCls: 'advanced-query-icon',
          disabled: true,
          tooltip: 'Use this menu to select the format of the query panel',
          menu: {
            items: [{
              itemId: 'simple',
              text: 'Simple',
              iconCls: 'simple-query-icon',
              tooltip: 'A simple yet powerful Google-like query interface'
            },
            {
              itemId: 'guided',
              text: 'Guided',
              iconCls: 'guided-query-icon',
              tooltip: 'A faceted Amazon-like query interface'
            },
            {
              itemId: 'advanced',
              text: 'Advanced',
              iconCls: 'advanced-query-icon',
              tooltip: 'An advanced builder-like query interface'
            },
            {
              itemId: 'user',
              text: 'User-defined',
              // &sdot; <span style="text-decoration: underline !important;">Dimeric protein structures at high-res</span>',
              iconCls: 'user-query-icon',
              tooltip: 'A collection of user-defined queries stored in BioMart',
              menu: [{
                text: 'Human genes on chromosome 1',
                iconCls: 'simple-query-icon'
              },
              {
                text: 'Dimeric protein structures at high-res',
                iconCls: 'guided-query-icon'
              },
              {
                text: 'Human genes on chromosome 7 associated with Huntington\'s disease',
                iconCls: 'advanced-query-icon'
              }]
            }],
            listeners: {
              'itemclick': {
                fn: function(item) {
                  var query = this;
                  var args = {
                    query: item.getItemId()
                  };
                  query.select(args);
                },
                scope: this // query
              }
            }
          }
        },
        '-', {
          itemId: 'customize',
          ref: '../customizeButton',
          cls: 'x-btn-text-icon',
          text: 'Add filter',
          iconCls: 'add-icon',
          disabled: true,
          tooltip: 'Press this button to customize the query form by adding/removing filters',
          handler: function() {
            var query = this;
            query.customize();
          },
          scope: this // query
        },
        {
          itemId: 'save',
          ref: '../saveButton',
          cls: 'x-btn-text-icon',
          text: 'Save query',
          iconCls: 'save-icon',
          disabled: true,
          tooltip: 'Press this button to save the query in various formats',
          handler: function() {
            var query = this;
            query.save();
          },
          scope: this // query
        }]
      },
      bbar: ['->', {
        itemId: 'reset',
        ref: '../resetButton',
        cls: 'x-btn-text-icon',
        text: 'Reset',
        iconCls: 'reset-icon',
        disabled: true,
        tooltip: 'Press this button to reset the current query',
        handler: function() {
          var query = this;
          query.reset();
        },
        scope: this // query
      },
      {
        itemId: 'submit',
        ref: '../submitButton',
        cls: 'x-btn-text-icon',
        text: 'Submit',
        iconCls: 'submit-icon',
        disabled: true,
        tooltip: 'Press this button to submit the current query to BioMart',
        handler: function() {
          var query = this;
          query.submit();
        },
        scope: this // query
      }],
      autoDestroy: true,
      autoScroll: true,
      defaults: {
        border: false,
        autoDestroy: true,
        autoWidth: true,
        autoHeight: true,
        fitToFrame: true,
        padding: 10,
        bodyStyle: 'background-color:#dfe8f6;',
        labelAlign: 'top',
        defaults: {
          anchor: '100%'
        }
      },
      items: []
    };

    // add custom events
    this.addEvents('select', 'submit', 'customize', 'save');

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Query.superclass.initComponent.apply(this, arguments);
  },

  select: function(args) {
    var query = this;
    query.fireEvent('select', args);
  },

  submit: function() {
    var query = this;
    query.fireEvent('submit');
  },

  customize: function() {
    var query = this;
    query.fireEvent('customize');
  },

  save: function() {
    var query = this;
    query.fireEvent('save');
  },

  update: function(args) {
    var query = this;

    // enable buttons
    query.selectButton.enable();
    query.selectButton.setIconClass(args.query + '-query-icon');
    query.selectButton.setText(args.query.charAt(0).toUpperCase() + args.query.slice(1));
    query.customizeButton.disable().hide();
    query.saveButton.enable();
    query.resetButton.enable();
    query.submitButton.enable();

    if (args.query == 'simple') {
      // pass
    } else if (args.query == 'guided') {
      query.submitButton.disable();
    } else if (args.query == 'advanced') {
      query.customizeButton.enable().show();
      // remember previously set filter values
      try {
        var filters = query.items.first().getForm().getValues();
        Ext.each(args.filters, function(filter) {
          if (filter.name in filters) {
            filter.value = filters[filter.name];
          }
        });
      } catch(e) {
        // pass
      }
    } else if (args.query == 'user') {
      query.customizeButton.enable().show();
    }

    // update form
    query.removeAll();
    query.add({
      xtype: args.query + 'query',
      itemId: args.query,
      ref: args.query
    });
    query.doLayout();
    query.items.first().update(args);

    // submit query, except for guided query when already init
    if (args.query != 'guided' || (args.query == 'guided' && typeof(args.facets) == 'undefined')) {
      query.submit();
    }
  },

  clear: function() {
    var query = this;
    query.removeAll();
    query.selectButton.disable();
    query.customizeButton.disable();
    query.saveButton.disable();
    query.resetButton.disable();
    query.submitButton.disable();
    query.doLayout();
  },

  reset: function() {
    var query = this;

    // reset form
    query.items.first().reset();

    // submit query
    query.submit();
  },

  build: function(args) {
    var query = this;
    return query.items.first().build(args);
  },

  isValid: function() {
    return this.items.first().getForm().isValid();
  },

  focus: function() {
    try {
      this.items.first().focus();
    } catch(e) {
      // pass
    }
  }
});

Ext.reg('query', Martview.Query);
