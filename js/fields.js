Ext.namespace('Martview');

Martview.Fields = Ext.extend(Ext.Window, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      modal: true,
      width: 880,
      height: 600,
      layout: 'border',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      iconCls: 'edit_icon',
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
        xtype: 'checktreepanel',
        itemId: 'all_fields',
        rootVisible: false,
        bubbleCheck: 'none',
        cascadeCheck: 'none',
        animate: true,
        enableDD: false,
        autoScroll: true,
        // containerScroll: true,
        loader: new Ext.tree.TreeLoader(),
        lines: true,
        // singleExpand: true,
        // selModel: new Ext.tree.MultiSelectionModel(),
        title: 'All ' + this.getId(),
        iconCls: 'node_all_icon',
        width: 330,
        split: true,
        collapsible: true,
        collapseMode: 'mini',
        hideCollapseTool: true,
        root: {
          uiProvider: false
        },
        loader: {
          dataUrl: './json/cporcellus_gene_ensembl.attributes.json'
        },
        deferredRender: false,
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
              var selected_fields = this.ownerCt.get('selected_fields');
              selected_fields.add({
                xtype: 'field',
                treenode: node,
                display_name: this.field_display_name,
                iconCls: this.field_iconCls
              });
              selected_fields.doLayout();
              node.disable();
            }
          }
        }
      },
      {
        region: 'center',
        itemId: 'selected_fields',
        items: [],
        autoScroll: true,
        padding: 10,
        title: 'Selected ' + this.getId(),
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
          cls: 'x-btn-text-icon'
        }]
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Fields.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('fields', Martview.Fields);
