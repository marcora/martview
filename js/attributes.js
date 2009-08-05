Ext.namespace('Martview');

Martview.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
  initComponent: function () {
    Martview.SearchField.superclass.initComponent.call(this);
    this.on('specialkey', function (f, e) {
      if (e.getKey() == e.ENTER) {
        this.onTrigger2Click();
      }
    },
    this);
  },

  validationEvent: false,
  validateOnBlur: false,
  trigger1Class: 'x-form-clear-trigger',
  trigger2Class: 'x-form-search-trigger',
  hideTrigger1: true,
  hasSearch: false,
  paramName: 'query',

  onTrigger1Click: function () {
    if (this.hasSearch) {
      Ext.getCmp('attributestree').filter.clear();
      Ext.getCmp('attributestree').root.collapse(true);
      this.setValue('');
      this.hasSearch = false;
      this.triggers[0].hide();
      this.focus();
    }
  },

  onTrigger2Click: function () {
    var val = this.getRawValue().trim();
    if (val.length < 1) {
      this.onTrigger1Click();
      return;
    }
    var re = new RegExp('.*' + val + '.*', 'i');
    Ext.getCmp('attributestree').filter.clear();
    // Ext.getCmp('attributestree').root.expand(true);
    Ext.getCmp('attributestree').filter.filter(re, 'text');
    // Ext.getCmp('attributestree').filter.filterBy(function(node) {
    //     if (!node.isLeaf()) {
    //         return false
    //         // return re.test(node.text);
    //     } else {
    //         return true;
    //     }
    // });
    this.hasSearch = true;
    this.triggers[0].show();
    this.focus();
  }
});

Ext.reg('search', Martview.SearchField);

Martview.Attributes = Ext.extend(Ext.Window, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      id: 'attributes',
      title: 'Customize view',
      modal: true,
      width: 700,
      height: 500,
      layout: 'border',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      buttons: [{
        text: 'Submit',
        disabled: true,
        handler: function () {
          // do something here
          this.ownerCt.ownerCt.hide();
        }
      },
      {
        text: 'Close',
        handler: function () {
          this.ownerCt.ownerCt.hide();
        }
      }],
      items: [{
        region: 'west',
        xtype: 'checktreepanel',
        id: 'attributestree',
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
        title: 'All attributes',
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
        itemCls: 'field_icon',
        tbar: [{
          xtype: 'search',
          id: 'searchattributes',
          width: 200
        },
        '->', {
          iconCls: 'icon-collapse-all',
          tooltip: 'Collapse All',
          handler: function () {
            Ext.getCmp('attributestree').root.collapse(true);
          }
        },
        {
          iconCls: 'icon-expand-all',
          tooltip: 'Expand All',
          handler: function () {
            Ext.getCmp('attributestree').root.expand(true);
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
              this.ownerCt.buttons[0].enable();
              var selattrs = Ext.getCmp('selattrs');
              node.disable();
              selattrs.add({
                xtype: 'displayfield',
                name: node.id,
                fieldLabel: node.attributes.display_name || node.attributes.name,
                labelSeparator: '&nbsp;<img style="vertical-align:middle;" src="./ico/delete.png" />'
              });
              selattrs.doLayout();
            }
          }
        }
      },
      {
        region: 'center',
        id: 'selattrs',
        xtype: 'form',
        labelWidth: 200,
        autoScroll: true,
        padding: 10,
        title: 'Selected attributes',
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
    Martview.Attributes.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('attributes', Martview.Attributes);
