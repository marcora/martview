Ext.ns('Martview');

Martview.Field = Ext.extend(Ext.Panel, {

  // soft config
  node: null,
  editable: false,
  field_iconCls: '',
  display_name: '',

  // hard config
  initComponent: function() {
    var config = {
      itemId: this.node.id,
      shadow: new Ext.Shadow(),
      draggable: {
        ddGroup: 'allDDGroup',
        startDrag: function(x, y) {
          // get panel ghost
          var ghost = Ext.get(this.getDragEl());

          // customize panel ghost
          try {
            ghost.child('ul').remove(); // remove spurios ul element!?!
          } catch(e) {
            // pass
          }
          ghost.removeClass('x-panel-ghost');
          ghost.addClass('x-dd-drag-proxy');
          ghost.addClass('x-dd-drop-nodrop');
          Ext.DomHelper.append(ghost, {
            tag: 'div',
            cls: 'x-dd-drop-icon'
          });

          // copy field html into panel ghost
          var el = Ext.get(this.proxy.panel.getEl());
          Ext.DomHelper.append(ghost, {
            tag: 'div',
            cls: 'x-dd-drag-ghost field-ghost',
            html: el.child('div.x-panel-tbar').dom.innerHTML
          });

          // add shadow to panel ghost
          this.shadow = new Ext.Shadow();
          this.shadow.show(ghost);
        },
        onDrag: function() {
          // align shadow with ghost while dragging
          var pel = this.proxy.getEl();
          this.shadow.realign(pel.getLeft(true), pel.getTop(true), pel.getWidth(), pel.getHeight());
        },
        endDrag: function() {
          // hide shadow when dragging ends
          this.shadow.hide();
        },
        onDragOver: function(e, targetId) {
          // change drop icon to ok when inside drop zone
          var ghost = Ext.get(this.getDragEl());
          ghost.removeClass('x-dd-drop-nodrop');
          ghost.addClass('x-dd-drop-ok');
        },
        onDragOut: function(e, targetId) {
          // change drop icon to nodrop when outside of drop zone
          var ghost = Ext.get(this.getDragEl());
          ghost.addClass('x-dd-drop-nodrop');
          ghost.removeClass('x-dd-drop-ok');
        }
      },
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
        tooltip: 'Press this button to delete this ' + this.display_name.substr(0, this.display_name.length - 1),
        scope: this,
        handler: function() {
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

  constructor: function(config) {
    config = config || {};
    config.listeners = config.listeners || {};
    Ext.applyIf(config.listeners, {
      // configure listeners here
      afterrender: function(field) {
        field.node.disable();
      },
      beforedestroy: function(field) {
        field.node.enable();
      }
    });

    // call parent
    Martview.Field.superclass.constructor.call(this, config);
  }
});

Ext.reg('field', Martview.Field);
