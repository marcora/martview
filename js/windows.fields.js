Ext.namespace('Martview.windows');

/* -------------------------
   Filters/attributes window
   ------------------------- */
Martview.windows.Fields = Ext.extend(Ext.Window, {
  // soft config
  display_name: null,
  dataset_name: null,
  field_iconCls: null,
  children: [],
  default_fields: [],
  current_fields: [],
  fields_changed: false,

  // hard config
  initComponent: function () {
    var config = {
      modal: true,
      width: 800,
      height: 500,
      layout: 'border',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      cls: 'fields',
      iconCls: 'add-icon',
      buttons: [{
        text: 'Cancel',
        cls: 'x-btn-text-icon',
        iconCls: 'reset-icon',
        handler: function () {
          this.fields_changed = false;
          this.hide();
          this.resetToCurrentFields();
        },
        scope: this // scope button to window
      },
      {
        text: 'OK',
        cls: 'x-btn-text-icon',
        iconCls: 'submit-icon',
        handler: function () {
          this.fields_changed = true;
          this.hide();
        },
        scope: this // scope button to window
      }],
      items: [{
        region: 'west',
        xtype: 'arraytreepanel',
        ref: 'all',
        itemId: 'all',
        title: 'All ' + this.display_name + 's',
        // iconCls: 'node-all-icon',
        width: 380,
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
        tbar: {
          layout: 'hbox',
          items: [{
            xtype: 'treefilterfield',
            itemId: 'search',
            ref: 'search',
            flex: 1,
            emptyText: 'Enter search terms to find a specific ' + this.display_name
            // listeners: {
            //   'render': {
            //     fn: function () {
            //       this.focus();
            //     },
            //     delay: 500
            //   }
            // }
          },
          ' ', {
            itemId: 'expand_all',
            cls: 'x-btn-text-icon',
            iconCls: 'icon-expand-all',
            text: 'Expand',
            handler: function () {
              this.ownerCt.search.onTrigger1Click();
              this.ownerCt.ownerCt.root.expand(true);
              // this.ownerCt.search.focus();
            }
          },
          {
            itemId: 'collapse_all',
            cls: 'x-btn-text-icon',
            iconCls: 'icon-collapse-all',
            text: 'Collapse',
            handler: function () {
              this.ownerCt.search.onTrigger1Click();
              this.ownerCt.ownerCt.root.collapse(true);
              // this.ownerCt.search.focus();
            }
          }]
        },
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
        title: 'Selected ' + this.display_name + 's',
        // iconCls: 'node-selected-icon',
        bodyStyle: 'background-color:#dfe8f6;',
        //         layout: 'vbox',
        //         layoutConfig: {
        //           align: 'stretch',
        //           pack: 'start'
        //         },
        tbar: [{
          text: 'Reset to default ' + this.display_name + 's',
          iconCls: 'undo-icon',
          cls: 'x-btn-text-icon',
          handler: this.resetToDefaultFields,
          scope: this
        }]
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.windows.Fields.superclass.initComponent.apply(this, arguments);
  },

  rememberCurrentFields: function () {
    var selected = this.get('selected'); // FIXME: why not this.selected?!?
    this.current_fields = [];
    selected.items.each(function (item) {
      this.current_fields.push(item.treenode);
    },
    this);
  },

  resetToCurrentFields: function () {
    var all = this.get('all'); // FIXME: why not this.selected?!?
    var selected = this.get('selected'); // FIXME: why not this.selected?!?
    selected.items.each(function (item) {
      item.treenode.enable();
      selected.remove(item);
    });
    Ext.each(this.current_fields, function (current_field) {
      var node = all.getNodeById(current_field.id);
      var field = selected.add({
        xtype: 'field',
        treenode: node,
        field_iconCls: this.field_iconCls
      });
      node.disable();
    },
    this);
    selected.doLayout();
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
