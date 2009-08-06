Ext.namespace('Martview');

Martview.Attribute = Ext.extend(Ext.Toolbar, {
  name: null,
  display_name: null,
  editable: false,

  initComponent: function () {

    Ext.apply(this, {
      //      bodyStyle: 'background-color:#dfe8f6;',
      items: [{
        text: (this.display_name || this.name),
        iconCls: 'attribute_icon',
        cls: 'x-btn-text-icon'
      },
      {
        xtype: 'textfield',
        hidden: this.editable
      },
      '->', {
        text: 'Delete',
        iconCls: 'delete_icon',
        cls: 'x-btn-text-icon',
        handler: function () {
          var attributestree = Ext.getCmp('attributestree');
          var selattributes = Ext.getCmp('selattributes');
          var attribute = this.ownerCt;
          attributestree.getNodeById(attribute.getItemId()).enable();
          selattributes.remove(attribute);
        }
      }]
    });

    Martview.Attribute.superclass.initComponent.apply(this, arguments);
  }

});
Ext.reg('attribute', Martview.Attribute);
