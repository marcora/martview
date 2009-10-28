Ext.ns('Martview.query');

Martview.query.Advanced = Ext.extend(Ext.form.FormPanel, {

  // hard config
  initComponent: function() {
    var config = {
      items: [{
        xtype: 'fieldset',
        itemId: 'filters',
        ref: 'filters',
        title: 'Filters',
        autoHeight: true,
        autoDestroy: true,
        defaults: {
          anchor: '100%',
          labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;'
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.query.Advanced.superclass.initComponent.apply(this, arguments);
  },

  update: function(args) {
    var form = this;

    // remove fields from filters fieldset
    form.filters.removeAll();

    // add fields to filters fieldset
    Ext.each(args.filters, function(filter) {
      if (filter.qualifier) { // filter.qualifier should never be null or undefined!
        if (filter.qualifier in {
          '=': '',
          '>': '',
          '<': '',
          '>=': '',
          '<=': ''
        }) {
          if (filter.options) {
            form.filters.add([{
              xtype: 'combo',
              itemId: filter.name,
              name: filter.name,
              fieldLabel: filter.display_name || filter.name,
              editable: false,
              forceSelection: true,
              lastSearchTerm: false,
              triggerAction: 'all',
              mode: 'local',
              store: filter.options.split(',')
            }]);
          } else {
            form.filters.add([{
              xtype: 'textfield',
              itemId: filter.name,
              name: filter.name,
              fieldLabel: filter.display_name || filter.name
            }]);
          }
        } else if (filter.qualifier.split(',').remove('=') in {
          'in': ''
        }) {
          form.filters.add({
            xtype: 'textarea',
            height: '100',
            itemId: filter.name + '_text',
            name: filter.name,
            fieldLabel: filter.display_name || filter.name
          });
          form.filters.add({
            xtype: 'fileuploadfield',
            itemId: filter.name + '_file',
            name: filter.name,
            hideLabel: true,
            // buttonOnly: true,
            buttonText: 'Upload file&hellip;'
          });
        } else if (filter.qualifier.split(',')[0] in {
          'only': '',
          'excluded': ''
        }) {
          var items = [];
          Ext.each(filter.qualifier.split(','), function(item) {
            items.push({
              inputValue: item,
              name: filter.name,
              boxLabel: item
            });
          });
          form.filters.add({
            xtype: 'radiogroup',
            itemId: filter.name,
            name: filter.name,
            fieldLabel: filter.display_name || filter.name,
            items: items
            // vertical: true,
            // columns: 1,
          });
        }

        // set field value if defined
        var field = form.filters.get(filter.name);
        if (field && filter.value) {
          field.setValue(filter.value);
        }
      }
    });

    // refresh form layout
    form.doLayout();

    // submit query on enter key
    form.filters.items.each(function(item) {
      item.on('specialkey', function(f, o) {
        if (o.getKey() == 13) {
          form.ownerCt.fireEvent('submit');
        }
      });
    });

  },

  reset: function() {
    var form = this;

    // clear all filters
    form.filters.items.each(function(filter) {
      filter.reset();
    });

    // refresh form layout
    form.doLayout();
  },

  focus: function() {
    var form = this;
    form.filters.items.first().focus(false, true);
  },

  build: function(args) {
    var form = this;

    // build xml query for martservice based of selected filters and attributes
    var dataset_filters = [];
    form.filters.items.each(function(item) {
      if (item.isXType('radiogroup')) {
        try {
          dataset_filters.push({
            name: item.getName(),
            excluded: (item.getValue().getGroupValue() == 'excluded') ? 1 : 0
          });
        } catch(e) {
          // pass in case no radio is selected
        }
      } else if (item.isXType('fileuploadfield')) {
        // TODO
      } else if (item.isXType('textarea')) {
        var list = item.getValue().split('\n').join(',');
        if (list) {
          dataset_filters.push({
            name: item.getName(),
            value: list
          });
        }
      } else if (item.isXType('textfield') || item.isXType('combo')) {
        if (item.getValue().trim()) {
          dataset_filters.push({
            name: item.getName(),
            value: item.getValue().trim()
          });
        }
      }
    });

    var formatter = args.formatter;
    var limitSize = args.limitSize;
    var dataset_attributes = args.attributes;
    var dataset_name = args.dataset_name;
    var values = {
      virtualSchemaName: 'default',
      datasetInterface: 'default',
      datasetConfigVersion: '',
      count: 0,
      header: 0,
      uniqueRows: 1,
      formatter: formatter,
      limitSize: limitSize,
      datasetName: dataset_name,
      datasetFilters: dataset_filters,
      datasetAttributes: dataset_attributes
    };
    var tpl = new Ext.XTemplate( //
    '<?xml version="1.0" encoding="UTF-8"?>', //
    '<!DOCTYPE Query>', //
    '<Query virtualSchemaName="{virtualSchemaName}" formatter="{formatter}" header="{header}" uniqueRows="{uniqueRows}" count="{count}" limitSize="{limitSize}" datasetConfigVersion="{datasetConfigVersion}">', //
    '<Dataset name="{datasetName}" interface="{datasetInterface}">', //
    '<tpl for="datasetFilters">', //
    '<tpl if="typeof(value) == \'undefined\'">', //
    '<Filter name="{name}" excluded="{excluded}"/>', //
    '</tpl>', //
    '<tpl if="typeof(excluded) == \'undefined\'">', //
    '<Filter name="{name}" value="{value}"/>', //
    '</tpl>', //
    '</tpl>', //
    '<tpl for="datasetAttributes">', //
    '<Attribute name="{name}"/>', //
    '</tpl>', //
    '</Dataset>', //
    '</Query>' //
    );
    var xml = tpl.apply(values);

    // build query params
    var query_params = {
      type: 'query',
      xml: xml
    };

    return query_params;
  }
});

Ext.reg('advancedquery', Martview.query.Advanced);