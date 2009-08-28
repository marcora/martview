Ext.namespace('Martview.windows');

Martview.windows.Loading = Ext.extend(Object, {
  start: function () {
    if (!this.msg || !this.msg.isVisible()) {
      this.msg = Ext.Msg.show({
        title: Martview.APP_TITLE,
        msg: 'Loading...',
        wait: true,
        waitConfig: {
          interval: 200
        }
      });
    }
  },
  stop: function () {
    if (this.msg && this.msg.isVisible()) {
      this.msg.hide();
    }
  }
});

Martview.windows.Help = Ext.extend(Ext.Window, {
  id: 'help',
  title: Martview.APP_TITLE,
  modal: true,
  width: 400,
  height: 300,
  html: 'biomart help'
});

Martview.windows.Fields = Ext.extend(Ext.Window, {
  // soft config
  display_name: null,
  dataset_name: null,
  field_iconCls: null,
  children: [],
  default_fields: [],

  // hard config
  initComponent: function () {
    Ext.applyIf(this, {
      modal: true,
      width: 880,
      height: 550,
      layout: 'border',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      iconCls: 'add_icon',
      buttons: [{
        text: 'Close',
        cls: 'x-btn-text-icon',
        iconCls: 'close_icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      }],
      items: [{
        region: 'west',
        xtype: 'arraytreepanel',
        ref: 'all',
        itemId: 'all',
        title: 'All ' + this.display_name.toLowerCase(),
        iconCls: 'node_all_icon',
        width: 330,
        split: true,
        collapsible: true,
        collapseMode: 'mini',
        hideCollapseTool: true,
        rootVisible: false,
        defaultTools: false,
        children: this.children,
        animate: true,
        enableDD: false,
        autoScroll: true,
        lines: true,
        // containerScroll: true,
        // singleExpand: true,
        // selModel: new Ext.tree.MultiSelectionModel(),
        tbar: [{
          xtype: 'treefilterfield',
          itemId: 'search',
          width: 200
        },
        '->', {
          itemId: 'collapse_all',
          iconCls: 'icon-collapse-all',
          tooltip: 'Collapse All',
          handler: function () {
            this.ownerCt.ownerCt.root.collapse(true);
          }
        },
        {
          itemId: 'expand_all',
          iconCls: 'icon-expand-all',
          tooltip: 'Expand All',
          handler: function () {
            this.ownerCt.ownerCt.root.expand(true);
          }
        }],
        listeners: {
          beforerender: function () {
            this.filter = new Ext.ux.tree.TreeFilterX(this, {
              expandOnFilter: true
            });
          },
          afterrender: function () {
            var all = this.ownerCt.get('all'); // FIXME: why not this.ownerCt.all?!?
            var selected = this.ownerCt.get('selected'); // FIXME: why not this.ownerCt.selected?!?
            Ext.each(this.ownerCt.default_fields, function (default_field) {
              var node = all.getNodeById(default_field.id);
              selected.add({
                xtype: 'field',
                treenode: node,
                field_iconCls: selected.ownerCt.field_iconCls
              });
              node.disable();
            });
            selected.doLayout();
          },
          dblclick: function (node) {
            if (node.isLeaf()) {
              var selected = this.ownerCt.selected;
              selected.add({
                xtype: 'field',
                treenode: node,
                field_iconCls: selected.ownerCt.field_iconCls
              });
              selected.doLayout();
              node.disable();
            }
          }
        }
      },
      {
        region: 'center',
        itemId: 'selected',
        ref: 'selected',
        items: [],
        autoScroll: true,
        padding: 10,
        title: 'Selected ' + this.display_name.toLowerCase(),
        iconCls: 'node_selected_icon',
        bodyStyle: 'background-color:#dfe8f6;',
        //        layout: 'vbox',
        //        layoutConfig: {
        //          align: 'stretch',
        //          pack: 'start'
        //        },
        tbar: [{
          text: 'Reset to default',
          iconCls: 'undo_icon',
          cls: 'x-btn-text-icon',
          handler: this.resetToDefaultFields,
          scope: this
        }]
      }]
    });

    // call parent
    Martview.windows.Fields.superclass.initComponent.apply(this, arguments);
  },

  resetToDefaultFields: function () {
    var all = this.get('all'); // FIXME: why not this.selected?!?
    var selected = this.get('selected'); // FIXME: why not this.selected?!?
    selected.items.each(function (item) {
      item.treenode.enable();
      selected.remove(item);
    });
    Ext.each(this.default_fields, function (default_field) {
      var node = all.getNodeById(default_field.id);
      selected.add({
        xtype: 'field',
        treenode: node,
        field_iconCls: this.field_iconCls
      });
      node.disable();
    },
    this);
    selected.doLayout();
  }
});
