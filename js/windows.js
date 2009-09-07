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
      width: 750,
      height: 500,
      layout: 'border',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      cls: 'fields',
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
        width: 300,
        split: true,
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
          dblclick: function (node) {
            if (node.isLeaf()) {
              var selected = this.ownerCt.selected;
              var field = selected.add({
                xtype: 'field',
                treenode: node,
                field_iconCls: selected.ownerCt.field_iconCls
              });
              node.disable();
              selected.doLayout();
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
        //         layout: 'vbox',
        //         layoutConfig: {
        //           align: 'stretch',
        //           pack: 'start'
        //         },
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
      var field = selected.add({
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

Martview.windows.SaveResults = Ext.extend(Ext.Window, {

  // hard config
  initComponent: function () {
    Ext.applyIf(this, {
      title: 'Save results',
      modal: true,
      width: 750,
      height: 500,
      layout: 'fit',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      iconCls: 'save_icon',
      buttons: [{
        text: 'Cancel',
        cls: 'x-btn-text-icon',
        iconCls: 'close_icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      },
      {
        text: 'Ok',
        cls: 'x-btn-text-icon',
        iconCls: 'submit_icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      }],
      items: [{
        xtype: 'form'
      }]
    });

    // call parent
    Martview.windows.SaveResults.superclass.initComponent.apply(this, arguments);
  }
});

Martview.windows.SaveSearch = Ext.extend(Ext.Window, {

  // hard config
  initComponent: function () {
    Ext.applyIf(this, {
      title: 'Save search',
      modal: true,
      width: 750,
      height: 500,
      layout: 'fit',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      iconCls: 'save_icon',
      buttons: [{
        text: 'Cancel',
        cls: 'x-btn-text-icon',
        iconCls: 'close_icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      },
      {
        text: 'Ok',
        cls: 'x-btn-text-icon',
        iconCls: 'submit_icon',
        handler: function () {
          this.hide();
        },
        scope: this // scope button to window
      }],
      items: [{
        xtype: 'form'
      }]
    });

    // call parent
    Martview.windows.SaveSearch.superclass.initComponent.apply(this, arguments);
  }
});
