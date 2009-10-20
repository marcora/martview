Ext.namespace('Martview');

Martview.Search = Ext.extend(Ext.Panel, {

  // hard config
  initComponent: function () {
    var config = {
      id: 'search',
      ref: '../search',
      region: 'west',
      layout: 'card',
      autoScroll: true,
      border: true,
      width: 440,
      split: true,
      bodyStyle: 'background-color:#dfe8f6;',
      title: 'Search',
      tbar: {
        // cls: 'x-panel-header',
        // height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          cls: 'x-btn-text-icon',
          text: 'Advanced',
          iconCls: 'advanced-search-icon',
          disabled: true,
          tooltip: 'Use this menu to select the format of the search panel',
          menu: [{
            itemId: 'simple',
            text: 'Simple',
            iconCls: 'simple-search-icon',
            handler: function () {
              var params = {
                search: 'simple'
              };
              this.select(params);
            },
            scope: this // search
          },
          {
            itemId: 'guided',
            text: 'Guided',
            iconCls: 'guided-search-icon',
            handler: function () {
              var params = {
                search: 'guided'
              };
              this.select(params);
            },
            scope: this // search
          },
          {
            itemId: 'advanced',
            text: 'Advanced',
            iconCls: 'advanced-search-icon',
            handler: function () {
              var params = {
                search: 'advanced'
              };
              this.select(params);
            },
            scope: this // search
          },
          {
            itemId: 'user',
            text: 'User-defined &sdot; <span style="text-decoration: underline !important;">Dimeric protein structures at high-res</span>',
            iconCls: 'user-search-icon',
            handler: function () {
              var params = {
                search: 'user'
              };
              this.select(params);
            },
            scope: this // search
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          cls: 'x-btn-text-icon',
          text: 'Add filter',
          iconCls: 'add-icon',
          disabled: true,
          tooltip: 'Press this button to customize the search form by adding/removing filters'
        },
        {
          itemId: 'save',
          ref: '../saveButton',
          cls: 'x-btn-text-icon',
          text: 'Save search',
          iconCls: 'save-icon',
          disabled: true,
          tooltip: 'Press this button to save the search in various formats'
        }]
      },
      bbar: ['->', {
        itemId: 'reset',
        ref: '../resetButton',
        cls: 'x-btn-text-icon',
        text: 'Reset',
        iconCls: 'reset-icon',
        disabled: true
      },
      {
        itemId: 'submit',
        ref: '../submitButton',
        cls: 'x-btn-text-icon',
        text: 'Submit',
        iconCls: 'submit-icon',
        disabled: true
      }],
      activeItem: 0,
      // make sure the active item is set on the container config!
      defaults: {
        border: false,
        autoWidth: true,
        autoHeight: true,
        fitToFrame: true
      },
      items: [{
        itemId: 'clear',
        ref: 'clear'
      },
      {
        xtype: 'simplesearch',
        itemId: 'simple',
        ref: 'simple'
      },
      {
        xtype: 'guidedsearch',
        itemId: 'guided',
        ref: 'guided'
      },
      {
        xtype: 'advancedsearch',
        itemId: 'advanced',
        ref: 'advanced'
      },
      {
        xtype: 'usersearch',
        itemId: 'user',
        ref: 'user'
      }]
    };

    // add custom events
    this.addEvents('load', 'select');

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Search.superclass.initComponent.apply(this, arguments);
  },

  select: function (params) {
    var search = this;
    search.selectButton.enable();
    search.selectButton.setIconClass(params.search + '-search-icon');
    search.selectButton.setText(params.search.charAt(0).toUpperCase() + params.search.slice(1));
    search.customizeButton.disable().hide();
    search.saveButton.enable();
    search.resetButton.enable();
    search.submitButton.enable();
    if (params.search == 'simple') {
      // pass
    } else if (params.search == 'guided') {
      search.submitButton.disable();
    } else if (params.search == 'advanced') {
      search.customizeButton.enable().show();
    } else if (params.search == 'user') {
      search.customizeButton.enable().show();
    }
    search.layout.setActiveItem(params.search);
    search.fireEvent('select', params);
  },

  isValid: function () {
    return this.layout.activeItem.getForm().isValid();
  },

  focus: function () {
    return this.layout.activeItem.focus();
  }
});

Ext.reg('search', Martview.Search);
