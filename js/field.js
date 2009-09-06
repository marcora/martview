Ext.namespace('Martview');

Martview.Field = Ext.extend(Ext.Panel, {
  // soft config
  treenode: null,
  editable: false,
  field_iconCls: null,

  // hard config
  initComponent: function () {
    Ext.apply(this, {
      itemId: this.treenode.id,
      draggable: true,
      cls: 'field',
      border: false,
      tbar: [{
        text: this.treenode.attributes.display_name || this.treenode.attributes.name,
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
      //       {
      //         text: 'Move up',
      //         iconCls: 'moveup_icon',
      //         cls: 'x-btn-text-icon',
      //         handler: function () {
      //           console.log('move up');
      //           var field = this.ownerCt;
      //           var selected_fields = field.ownerCt;
      //           // move up
      //         }
      //       },
      //       {
      //         text: 'Move dn',
      //         iconCls: 'movedn_icon',
      //         cls: 'x-btn-text-icon',
      //         handler: function () {
      //           console.log('move dn');
      //           var field = this.ownerCt;
      //           var selected_fields = field.ownerCt;
      //           // move dn
      //         }
      //       },
      {
        text: 'Remove',
        iconCls: 'delete_icon',
        cls: 'x-btn-text-icon',
        scope: this,
        handler: function () {
          var field = this;
          var selected_fields = field.ownerCt;
          field.treenode.enable();
          selected_fields.remove(field);
        }
      }]
    });

    Martview.Field.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('field', Martview.Field);
