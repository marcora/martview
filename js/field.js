Ext.namespace('Martview');

Martview.Field = Ext.extend(Ext.Panel, {

  // soft config
  node: null,
  editable: false,
  field_iconCls: null,

  // hard config
  initComponent: function () {
    var config = {
      itemId: this.node.id,
      draggable: true,
      cls: 'field',
      border: false,
      tbar: [{
        text: this.node.attributes.display_name || this.node.attributes.name,
        tooltip: this.node.parentNode.parentNode.text + ' > ' + this.node.parentNode.text,
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
        iconCls: 'delete-icon',
        cls: 'x-btn-text-icon',
        scope: this,
        handler: function () {
          var field = this;
          var selected_fields = field.ownerCt;
          field.node.enable();
          selected_fields.remove(field);
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Field.superclass.initComponent.apply(this, arguments);
  },

  constructor: function (config) {
    config = config || {};
    config.listeners = config.listeners || {};
    Ext.applyIf(config.listeners, {
      // configure listeners here
      afterrender: function (field) {
        field.node.disable();
      },
      beforedestroy: function (field) {
        field.node.enable();
      }
    });

    // call parent
    Martview.Field.superclass.constructor.call(this, config);
  }
});

Ext.reg('field', Martview.Field);
