Ext.namespace('Martview');

Martview.Header = Ext.extend(Ext.Toolbar, {
  initComponent: function () {
    Ext.applyIf(this, {
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
        //         text: 'Home',
        //         iconCls: 'home_icon',
        hidden: false,
        menu: []
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
        text: 'Select the database you want to search',
        cls: 'x-btn-text-icon',
        iconCls: 'larrow_icon',
        hidden: false
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
        iconCls: 'dataset_icon',
        hidden: true
      },
      '->', {
        itemId: 'login',
        ref: 'loginButton',
        text: 'Login',
        iconCls: 'user_icon',
        cls: 'x-btn-text-icon',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Login');
        }
      },
      {
        itemId: 'help',
        ref: 'HelpButton',
        text: 'Help',
        iconCls: 'help_icon',
        cls: 'x-btn-text-icon',
        handler: function () {
          Ext.MessageBox.alert(Martview.APP_TITLE, 'Help');
        }
      }]
    });

    // call parent
    Martview.Header.superclass.initComponent.apply(this, arguments);
  },

  load: function (data, handler) {
    header = this;
    header.homeButton.setText(data.text);
    header.homeButton.setIconClass(data.iconCls);
    header.homeButton.menu.add(data.menu);

    function setHandler(menu) {
      menu.items.each(function (menu_item) {
        if (menu_item.menu) {
          menu_item.setIconClass('folder_icon');
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
                    handler(menu_item); // or window.location.search = 'mart=' + menu_item.mart_name + '&dataset=' + menu_item.dataset_name;
                  }
                }
              }]);
            }
          } else {
            menu_item.setIconClass('dataset_icon');
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
    header = this;
    header.homeButton.addClass('no-menu-arrow');
    header.homeSeparator.show();
    header.martButton.setIconClass('mart_icon').setText(params.mart_display_name || params.mart_name).show();
    header.martSeparator.show();
    header.datasetButton.setText(params.dataset_display_name || params.dataset_name).show();
    // update document title to match breadcrumbs
    document.title = header.homeButton.getText() + ' > ' + params.mart_display_name + ' > ' + params.dataset_display_name;
  }

});

Ext.reg('header', Martview.Header);
