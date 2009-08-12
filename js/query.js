Ext.namespace('Martview');

Martview.Query = Ext.extend(Object, {

  constructor: function (params) {
    Ext.applyIf(this, params);
  },

  getXml: function (values) {
    var filters = [];
    //     Ext.getCmp('attributes').getComponent('selected_fields').items.each(function (item) {
    //       filters.push({
    //         name: item.name,
    //         value: null //item.value
    //       });
    //     });
    var attributes = [];
    Ext.getCmp('attributes').getComponent('selected_fields').items.each(function (item) {
      attributes.push({
        name: item.treenode.attributes.name
      });
    });
    values = values || new Object;
    Ext.applyIf(values, {
      virtualSchemaName: 'default',
      formatter: 'CSV',
      header: 0,
      uniqueRows: 0,
      count: 0,
      limitSize: 100,
      datasetConfigVersion: '0.6',
      datasetInterface: 'default',
      datasetName: this.dataset_name,
      datasetFilters: filters,
      datasetAttributes: attributes
    });
    // TODO: raise if datasetName is null!
    var tpl = new Ext.XTemplate('<?xml version="1.0" encoding="UTF-8"?>', //
    '<!DOCTYPE Query>', //
    '<Query virtualSchemaName="{virtualSchemaName}" formatter="{formatter}" header="{header}" uniqueRows="{uniqueRows}" count="{count}" limitSize="{limitSize}" datasetConfigVersion="{datasetConfigVersion}">', //
    '<Dataset name="{datasetName}" interface="{datasetInterface}">', //
    '<tpl for="datasetFilters">', //
    '<Filter name="{name}" value="{value}"/>', //
    '</tpl>', //
    '<tpl for="datasetAttributes">', //
    '<Attribute name="{name}"/>', //
    '</tpl>', //
    '</Dataset>', //
    '</Query>');
    var xml = tpl.apply(values);
    console.log(xml);
    return xml;
  },

  getColModel: function () {
    var columns = [];
    Ext.getCmp('attributes').getComponent('selected_fields').items.each(function (item) {
      columns.push({
        header: item.treenode.attributes.display_name || item.treenode.attributes.name,
        width: 100,
        sortable: true
      });
    });
    return new Ext.grid.ColumnModel(columns);
  },

  getStore: function () {
    var fields = [];
    Ext.getCmp('attributes').getComponent('selected_fields').items.each(function (item) {
      fields.push({
        name: item.treenode.attributes.name
      });
    });
    return new Ext.data.JsonStore({
      autoDestroy: true,
      root: 'rows',
      fields: fields
    });
  }

});
