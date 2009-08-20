Ext.namespace('Martview');

Martview.Field = Ext.extend(Ext.Toolbar, {
  // soft config
  treenode: null,
  editable: false,
  field_iconCls: null,

  // hard config
  initComponent: function () {
    Ext.apply(this, {
      itemId: this.treenode.id,
      items: [{
        text: '<b>' + (this.treenode.attributes.display_name || this.treenode.attributes.name) + '</b>',
        tooltip: this.treenode.parentNode.parentNode.text + ' > ' + this.treenode.parentNode.text,
        iconCls: this.field_iconCls,
        cls: 'x-btn-text-icon'
      },
      {
        xtype: 'tbfill',
        hidden: !this.editable
      },
      {
        xtype: 'textfield',
        hidden: !this.editable
      },
      {
        xtype: 'tbspacer',
        hidden: !this.editable
      },
      {
        text: 'Remove',
        iconCls: 'delete_icon',
        cls: 'x-btn-text-icon',
        handler: function () {
          var field = this.ownerCt;
          var fields_tree = field.treenode.getOwnerTree();
          var selected_fields = field.ownerCt;
          fields_tree.getNodeById(field.getItemId()).enable();
          selected_fields.remove(field);
        }
      }]
    });

    Martview.Field.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('field', Martview.Field);
