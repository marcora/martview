Ext.namespace('Martview');

Martview.Header = Ext.extend(Ext.Toolbar, {

  // hard config
  initComponent: function () {
    var config = {
      region: 'north',
      id: 'header',
      ref: '../header',
      // FIX: should adjust height automatically
      height: 26,
      border: false,
      items: [{
        itemId: 'home',
        ref: 'homeButton',
        cls: 'x-btn-text-icon',
        text: 'Home',
        iconCls: 'home-icon',
        hidden: false,
        tooltip: 'Use this menu to select the database you want to search',
        menu: [{
          xtype: 'panel',
          iconCls: 'no-icon',
          height: 400,
          width: 800,
          border: false,
          layout: 'vbox',
          items: [{
            xtype: 'form',
            border: false,
            width: '100%',
            hideLabels: true,
            items: [{
              xtype: 'searchfield',
              anchor: '100%'
            }]
          },
          {
            xtype: 'grid',
            // border: false,
            width: '100%',
            flex: 1,
            hideHeaders: true,
            // autoHeight: true,
            // autoWidth: true,
            // fitToFrame: true,
            // singleSelect: true,
            enableHdMenu: false,
            stripeRows: true,
            sm: new Ext.grid.RowSelectionModel({
              singleSelect: true
            }),
            store: new Ext.data.JsonStore({
              url: './json/datasets.json',
              root: 'rows',
              autoLoad: true,
              autoDestroy: true,
              fields: ['mart_display_name', 'dataset_display_name', 'description', 'keywords']
            }),
            // view: new Ext.ux.grid.BufferView({
            //   // // custom row height
            //   // rowHeight: 10,
            //   forceFit: true,
            //   scrollOffset: 1,
            //   emptyText: 'There are no datasets to select',
            //   // render rows as they come into viewable area.
            //   scrollDelay: false
            // }),
            viewConfig: {
              forceFit: true
            },
            colModel: new Ext.grid.ColumnModel({
              columns: [{
                id: 'dataset',
                header: "Dataset",
                dataIndex: 'dataset_display_name',
                renderer: function (value, p, record) {
                    return String.format('<h2 style="color: #333 !important; font-size: 1.4em !important;">{0} <span style="font-weight: normal !important; color: #888 !important;">[{1}]</span></h2><p style="font-size: 1.2em !important; color: #444 !important;">{2}</p><p style="color: #888 !important;">{3}</p>', value, record.data.mart_display_name, record.data.description, record.data.keywords);
                },
                sortable: false
              }]
            })
          }],
          buttonAlign: 'center',
          buttons: [{
            text: 'Cancel',
            iconCls: 'reset-icon',
            handler: function () {
              this.ownerCt.ownerCt.ownerCt.hide();
            }
          },
          {
            text: 'Select',
            iconCls: 'submit-icon'
          }]
        }]
      },
      {
        itemId: 'home_sep',
        ref: 'homeSeparator',
        text: '>',
        hidden: true
      },
      {
        itemId: 'mart',
        ref: 'martButton',
        text: '<span style="color: #444 !important; font-weight: bold !important">Select the database you want to search</span>',
        // 'Select the database you want to search'
        cls: 'x-btn-text-icon',
        iconCls: 'larrow-icon',
        hidden: true
      },
      {
        itemId: 'mart_sep',
        ref: 'martSeparator',
        text: '>',
        hidden: true
      },
      {
        itemId: 'dataset',
        ref: 'datasetButton',
        text: 'dataset_name',
        cls: 'x-btn-text-icon',
        iconCls: 'dataset-icon',
        hidden: true
      },
      '->', {
        itemId: 'login',
        ref: 'loginButton',
        text: 'Login',
        iconCls: 'user-icon',
        cls: 'x-btn-text-icon',
        // tooltip: 'Press this button to log into BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Login');
        }
      },
      {
        itemId: 'help',
        ref: 'HelpButton',
        text: 'Help',
        iconCls: 'help-icon',
        cls: 'x-btn-text-icon',
        // tooltip: 'Press this button to get help on how to use BioMart',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Help');
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Header.superclass.initComponent.apply(this, arguments);
  },

  load: function (data, handler) {
    var header = this;
    header.homeButton.setText(data.text);
    header.homeButton.setIconClass(data.iconCls);
    header.homeButton.menu.add(data.menu);
    header.homeButton.show();
    header.martButton.show();

    function setHandler(menu) {
      menu.items.each(function (menu_item) {
        if (menu_item.menu) {
          menu_item.setIconClass('folder-icon');
          setHandler(menu_item.menu);
        } else {
          if (menu_item.isXType('menucheckitem')) {
            menu_item.setText('<img style=\"vertical-align: top !important;\" src=\"./ico/database.png\" />&nbsp;' + menu_item.text);
            if (!menu.items.get('select')) {
              menu.add([{
                text: '<img style=\"vertical-align: top !important;\" src=\"./ico/tick.png\" />&nbsp;Search the checked database(s)',
                itemId: 'select',
                // important to not upset params validation with multiselect menus!
                handler: function () {
                  var checked_datasets = [];
                  this.parentMenu.items.each(function (dataset_item) {
                    if (dataset_item.checked) checked_datasets.push(dataset_item);
                  });
                  if (checked_datasets.length > 0) {
                    var menu_item = checked_datasets[0];
                    if (checked_datasets.length > 1) menu_item.dataset_display_name += ' + ' + checked_datasets[1].dataset_display_name;
                    handler(menu_item); // or window.location.search = 'mart=' + menu_item.mart_name + '&dataset=' + menu_item.dataset_name;
                  }
                }
              }]);
            }
          } else {
            menu_item.setIconClass('dataset-icon');
            menu_item.on('click', function (menu_item) {
              handler(menu_item); // or window.location.search = 'mart=' + menu_item.mart_name + '&dataset=' + menu_item.dataset_name;
            });
          }
        }
      });
    }
    setHandler(header.homeButton.menu);
  },

  updateBreadcrumbs: function (params) {
    var header = this;
    header.homeButton.addClass('no-menu-arrow');
    header.homeSeparator.show();
    header.martButton.setIconClass('mart-icon').setText(params.mart_display_name || params.mart_name).show();
    header.martSeparator.show();
    header.datasetButton.setText(params.dataset_display_name || params.dataset_name).show();
    // update document title to match breadcrumbs
    document.title = header.homeButton.getText() + ' > ' + params.mart_display_name + ' > ' + params.dataset_display_name;
  }

});

Ext.reg('header', Martview.Header);
