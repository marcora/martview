Ext.namespace('Martview');

Martview.Field = Ext.extend(Ext.Toolbar, {
  treenode: null,

  initComponent: function () {

    this.editable = false;
    this.itemId = this.treenode.id;

    Ext.apply(this, {
      items: [{
        text: (this.treenode.attributes.display_name || this.treenode.attributes.name),
        iconCls: 'field_icon',
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
        text: 'Move',
        iconCls: 'move_icon',
        cls: 'x-btn-text-icon'
      },
      '-', {
        text: 'Delete',
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
