Ext.namespace('Martview');

Martview.Query = function (params) {
  Ext.applyIf(this, params);

  this.filters = new Martview.Fields({
    id: 'filters',
    title: 'Customize search'
  });

  this.attributes = new Martview.Fields({
    id: 'attributes',
    title: 'Customize results'
  });

  this.getXml = function (values) {
    var filters = [];
    this.filters.getComponent('selected_fields').items.each(function (item) {
      filters.push({
        name: item.treenode.attributes.name,
        value: '' // FIXME
      });
    });
    var attributes = [];
    this.attributes.getComponent('selected_fields').items.each(function (item) {
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
      datasetName: this.dataset_name,
      datasetInterface: 'default',
      datasetFilters: filters,
      datasetAttributes: attributes
    });
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
    return tpl.apply(values);
  };

  this.getColModel = function () {
    var columns = [];
    this.attributes.getComponent('selected_fields').items.each(function (item) {
      columns.push({
        header: item.treenode.attributes.display_name || item.treenode.attributes.name,
        width: 100,
        sortable: true
      });
    });
    return new Ext.grid.ColumnModel(columns);
  };

  this.getJsonStore = function () {
    var fields = [];
    this.attributes.getComponent('selected_fields').items.each(function (item) {
      fields.push({
        name: item.treenode.attributes.name
      });
    });
    return new Ext.data.JsonStore({
      root: 'rows',
      fields: fields
    });
  };
};
