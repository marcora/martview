Ext.ns('Martview.windows');

/* -------------------------
   Filters/attributes window
   ------------------------- */
Martview.windows.Fields = Ext.extend(Ext.Window, {
  // soft config:
  // id
  // display_name
  // dataset
  selected_fields: null,
  // null is important!
  // hard config
  initComponent: function() {
    var config = {
      default_fields: null,
      // null is important!
      removed_fields_names: [],
      added_fields_names: [],
      title: 'Customize ' + this.display_name,
      modal: true,
      width: 800,
      height: 500,
      layout: 'border',
      closeAction: 'hide',
      plain: true,
      border: false,
      autoDestroy: true,
      cls: 'fields',
      iconCls: 'customize-icon',
      buttonAlign: 'left',
      buttons: [{
        xtype: 'tbtext',
        text: '<img src="./ico/information.png" style="vertical-align: text-bottom;" />&nbsp;Double-click on a folder to expand/collapse it or on a ' + this.display_name.substr(0, this.display_name.length - 1) + ' to add it to the "Selected ' + this.display_name + '" panel'
      },
      {
        xtype: 'tbfill'
      },
      {
        text: 'Cancel',
        cls: 'x-btn-text-icon',
        iconCls: 'reset-icon',
        handler: function() {
          var window = this;
          window.hide();
        },
        scope: this // window
      },
      {
        text: 'Apply',
        cls: 'x-btn-text-icon',
        iconCls: 'submit-icon',
        handler: function() {
          var window = this;
          window.hide();
          window.rememberSelectedFields();
          window.fireEvent('update');
        },
        scope: this // window
      }],
      items: [{
        region: 'west',
        xtype: 'arraytreepanel',
        ref: '../all',
        itemId: 'all',
        title: 'All ' + this.display_name,
        // iconCls: 'node-all-icon',
        width: 390,
        split: true,
        rootVisible: false,
        defaultTools: false,
        children: this.dataset[this.id],
        animate: true,
        lines: true,
        enableDrag: true,
        dragConfig: {
          ddGroup: 'selectedDDGroup'
        },
        autoScroll: true,
        // containerScroll: true,
        // selModel: new Ext.tree.MultiSelectionModel(),
        tbar: {
          layout: 'hbox',
          items: [{
            xtype: 'treefilterfield',
            itemId: 'search',
            ref: '../search',
            flex: 1,
            emptyText: 'Enter terms to find a specific ' + this.display_name.substr(0, this.display_name.length - 1)
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
            text: 'Expand all',
            handler: function() {
              var window = this;
              window.all.search.onTrigger1Click();
              window.all.root.expand(true);
            },
            scope: this // window
          },
          {
            itemId: 'collapse_all',
            cls: 'x-btn-text-icon',
            iconCls: 'icon-collapse-all',
            text: 'Collapse all',
            handler: function() {
              var window = this;
              window.all.search.onTrigger1Click();
              window.all.root.collapse(true);
            },
            scope: this // window
          }]
        },
        listeners: {
          'beforerender': function() {
            this.filter = new Ext.ux.tree.TreeFilterX(this, {
              expandOnFilter: true
            });
          },
          'dblclick': {
            fn: function(node) {
              var window = this;
              if (node.isLeaf()) {
                window.addFields(node);
              }
            },
            scope: this // window
          },
          'render': {
            fn: function() {
              var window = this;
              var allDropTargetEl = window.items.get('all').body.dom;
              var allDropTarget = new Ext.dd.DropTarget(allDropTargetEl, {
                ddGroup: 'allDDGroup',
                notifyDrop: function(ddSource, e, data) {
                  window.removeFields(ddSource.panel.itemId);
                  return true;
                }
              });
            },
            scope: this // window
          }
        }
      },
      {
        region: 'center',
        itemId: 'selected',
        ref: '../selected',
        items: [],
        autoScroll: true,
        padding: 10,
        title: 'Selected ' + this.display_name,
        // iconCls: 'node-selected-icon',
        bodyStyle: 'background-color:#dfe8f6;',
        //         layout: 'vbox',
        //         layoutConfig: {
        //           align: 'stretch',
        //           pack: 'start'
        //         },
        listeners: {
          'render': {
            fn: function() {
              var window = this;
              var selectedDropTargetEl = this.items.get('selected').body.dom;
              var selectedDropTarget = new Ext.dd.DropTarget(selectedDropTargetEl, {
                ddGroup: 'selectedDDGroup',
                notifyDrop: function(ddSource, e, data) {
                  var selNode = ddSource.tree.selModel.selNode;
                  window.addFields(selNode);
                  return true;
                }
              });
            },
            scope: this // window
          }
        },
        tbar: [{
          text: 'Add',
          iconCls: 'add-icon',
          cls: 'x-btn-text-icon',
          tooltip: 'Press this button to add a ' + this.display_name.substr(0, this.display_name.length - 1) + '/folder from the "All ' + this.display_name + '" tree',
          handler: function() {
            var window = this;
            var selNode = window.all.selModel.selNode;
            if (selNode) {
              window.addFields(selNode);
            } else {
              Ext.MessageBox.alert(Martview.APP_TITLE, 'To add a ' + this.display_name.substr(0, this.display_name.length - 1) + ' you must first select it in the "All ' + this.display_name + '" tree on the left');
            }
          },
          scope: this // window
        },
        {
          text: 'Remove all',
          iconCls: 'delete-icon',
          cls: 'x-btn-text-icon',
          tooltip: 'Press this button to remove all selected ' + this.display_name,
          handler: function() {
            this.resetSelectedFields([]);
          },
          scope: this // window
        },
        {
          text: 'Reset to default',
          iconCls: 'undo-icon',
          cls: 'x-btn-text-icon',
          tooltip: 'Press this button to reset to the default ' + this.display_name,
          handler: function() {
            this.resetSelectedFields(this.getDefaultFields());
          },
          scope: this // window
        }]
      }]
    };

    // add custom events
    this.addEvents('update');

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.windows.Fields.superclass.initComponent.apply(this, arguments);

    // init all fields
    this.all_fields = [];
    this.flattenFields(this.dataset[this.id], this.all_fields);

    // validate selected fields and init them with default fields if empty
    this.selected_fields = this.validateFields(this.selected_fields);
    if (this.selected_fields.length === 0) {
      this.selected_fields = this.getDefaultFields();
    }
  },

  constructor: function(config) {
    config = config || {};
    config.listeners = config.listeners || {};
    Ext.applyIf(config.listeners, {
      // configure listeners here
      show: function(window) {
        window.added_fields_names = [];
        window.removed_fields_names = [];
        window.resetSelectedFields(window.getSelectedFields());
        (function() {
          window.all.search.getEl().frame("ff0000", 1);
        }).defer(300);
      },
      'hide': function(window) {
        window.reset();
      }
    });

    // call parent
    Martview.windows.Fields.superclass.constructor.call(this, config);
  },

  reset: function() {
    var window = this;
    window.all.filter.clear();
    window.all.root.collapse(true);
    window.all.search.setValue('');
    window.all.search.hasSearch = false;
    window.all.search.triggers[0].hide();
  },

  // add field to selected
  addFields: function(node_or_id_or_array) {
    if (!node_or_id_or_array) {
      return false;
    } else {
      var window = this;
      var all = window.get('all');
      var selected = window.get('selected');
      var node = null;
      if (typeof node_or_id_or_array == 'string') { // if id
        node = all.getNodeById(node_or_id_or_array);
      } else if (node_or_id_or_array.constructor.toString().indexOf("Array") != -1) { // if array
        Ext.each(node_or_id_or_array, function(node) {
          window.addFields(node);
        });
      } else if (node_or_id_or_array.xtype == 'treenode') { // if treenode
        node = node_or_id_or_array;
      } else if (typeof(node_or_id_or_array) == 'object') { // if object
        node = all.getNodeById(node_or_id_or_array['id']);
      }
      if (node && !node.disabled) {
        if (node.isLeaf()) {
          selected.add({
            xtype: 'field',
            itemId: node.id,
            node: node,
            field_iconCls: window.field_iconCls,
            display_name: window.display_name
          });
          selected.doLayout();
        } else {
          node.eachChild(function(node) {
            window.addFields(node);
          });
        }
      }
      return true;
    }
  },

  // remove field from selected
  removeFields: function(node_or_id_or_array) {
    if (!node_or_id_or_array) {
      return false;
    } else {
      var window = this;
      var all = window.get('all');
      var selected = window.get('selected');
      var node = null;
      if (typeof node_or_id_or_array == 'string') { // if id
        node = all.getNodeById(node_or_id_or_array);
      } else if (node_or_id_or_array.constructor.toString().indexOf("Array") != -1) { // if array
        Ext.each(node_or_id_or_array, function(node) {
          window.removeFields(node);
        });
      } else if (node_or_id_or_array.xtype == 'treenode') { // if treenode
        node = node_or_id_or_array;
      } else if (typeof(node_or_id_or_array) == 'object') { // if object
        node = all.getNodeById(node_or_id_or_array['id']);
      }
      if (node && node.disabled) {
        if (node.isLeaf()) {
          selected.remove(node.id);
          selected.doLayout();
        } else {
          node.eachChild(function(node) {
            window.removeFields(node);
          });
        }
      }
      return true;
    }
  },

  // return array of selected field objects
  getSelectedFields: function() {
    var window = this;
    return window.selected_fields;
  },

  // return array of selected field objects
  getAllFields: function() {
    var window = this;
    return window.all_fields;
  },

  // return array of default field objects
  getDefaultFields: function() {
    var window = this;
    if (window.default_fields === null) {
      window.default_fields = [];
      Ext.each(window.all_fields, function(field) {
        if (field['default']) {
          window.default_fields.push(field);
        }
      });
    }
    return window.default_fields;
  },

  // remember selected fields
  rememberSelectedFields: function() {
    var window = this;
    var selected = window.get('selected');
    var before_selected_fields_names = [];
    var after_selected_fields_names = [];

    // build array of selected fields names (before)
    Ext.each(window.selected_fields, function(selected_field) {
      before_selected_fields_names.push(selected_field.name);
    });

    // remember selected fields
    window.selected_fields = [];
    selected.items.each(function(item) {
      window.selected_fields.push(item.node.attributes);
    });

    // build array of selected fields names (after)
    Ext.each(window.selected_fields, function(selected_field) {
      after_selected_fields_names.push(selected_field.name);
    });

    // diff arrays of selected fields names before and after
    // to include only the names of fields that have been added/removed
    window.removed_fields_names = before_selected_fields_names.slice(0); // copy array
    Ext.each(after_selected_fields_names, function(after_selected_field_name) {
      window.removed_fields_names.remove(after_selected_field_name);
    });
    window.added_fields_names = after_selected_fields_names.slice(0); // copy array
    Ext.each(before_selected_fields_names, function(before_selected_field_name) {
      window.added_fields_names.remove(before_selected_field_name);
    });
  },

  // reset selected fields
  resetSelectedFields: function(node_or_id_or_array) {
    var window = this;
    var selected = window.get('selected');
    selected.removeAll();
    window.addFields(node_or_id_or_array);
  },

  // flatten fields tree into an array
  flattenFields: function(tree, array) {
    var window = this;
    Ext.each(tree, function(field) {
      if (field['leaf']) {
        array.push(field);
      } else { if (field['children']) {
          window.flattenFields(field['children'], array);
        }
      }
    });
  },

  // validate fields
  validateFields: function(fields) {
    fields = fields || [];
    var window = this;
    var valid_fields = [];
    Ext.each(fields, function(field) {
      Ext.each(window.all_fields, function(valid_field) {
        if (field['id'] == valid_field['id']) {
          Ext.applyIf(field, valid_field); // merge field and valid field
          valid_fields.push(field);
        }
      });
    });
    return valid_fields;
  }
});
