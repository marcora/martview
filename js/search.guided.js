Ext.namespace('Martview.search');

Martview.search.Guided = Ext.extend(Ext.form.FormPanel, {

  // soft config
  padding: 10,
  bodyStyle: 'background-color:#dfe8f6;',
  labelAlign: 'top',

  // hard config
  initComponent: function () {
    var config = {
      defaults: {
        anchor: '100%'
      },
      items: [{
        xtype: 'fieldset',
        title: 'Filters',
        itemId: 'filters',
        ref: 'filters',
        autoHeight: true,
        defaults: {
          anchor: '100%',
          // labelSeparator: '',
          labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;'
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.search.Guided.superclass.initComponent.apply(this, arguments);
  },

  update: function (params) {
    var form = this;

    // remove fields from search form
    form.removeAll();

    // add fieldset to search form
    var fieldset = form.add({
      xtype: 'fieldset',
      title: 'Filters',
      itemId: 'filters',
      ref: 'filters',
      autoHeight: true,
      defaults: {
        anchor: '100%',
        // labelSeparator: '',
        labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;'
      }
    });

    // add filters to search form
    if (filters) {
      fieldset.add(params.filters);
    }

    // refresh form layout and focus
    form.doLayout();
    form.focus();
  },

  reset: function () {
    var form = this;
    form.filters.items.each(function (item) {
      if (item.xtype == 'facetfield') {
        form.filters.add({
          xtype: 'unfacetfield',
          name: item.getName(),
          value: item.getValue()
        });
      }
    });
  },

  focus: function () {
    try {
      this.filters.items.first().focus(false, true);
    } catch(e) {
      // pass
    }
  }
});

Ext.reg('guidedsearch', Martview.search.Guided);
