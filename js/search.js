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
          text: 'Advanced',
          iconCls: 'advanced-search-icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          tooltip: 'Use this menu to select the format of the search panel',
          menu: [{
            itemId: 'simple',
            text: 'Simple',
            iconCls: 'simple-search-icon'
          },
          {
            itemId: 'guided',
            text: 'Guided',
            iconCls: 'guided-search-icon'
          },
          {
            itemId: 'advanced',
            text: 'Advanced',
            iconCls: 'advanced-search-icon'
          },
          {
            itemId: 'user',
            text: 'User-defined &sdot; <span style="text-decoration: underline !important;">Dimeric protein structures at high-res</span>',
            iconCls: 'user-search-icon'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Add filter',
          iconCls: 'add-icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          tooltip: 'Press this button to customize the search form by adding/removing filters'
        },
        {
          text: 'Save search',
          itemId: 'save',
          ref: '../saveButton',
          iconCls: 'save-icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          tooltip: 'Press this button to save the search in various formats'
        }]
      },
      bbar: ['->', {
        itemId: 'reset',
        ref: '../resetButton',
        text: 'Reset',
        iconCls: 'reset-icon',
        cls: 'x-btn-text-icon',
        disabled: true
      },
      {
        itemId: 'submit',
        ref: '../submitButton',
        text: 'Submit',
        iconCls: 'submit-icon',
        cls: 'x-btn-text-icon',
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
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Search.superclass.initComponent.apply(this, arguments);
  },

  enableTopButtons: function (customize) {
    var search = this;
    search.selectButton.enable();
    if (customize) {
      search.customizeButton.enable();
      search.customizeButton.show();
    } else {
      search.customizeButton.hide();
    }
    search.saveButton.enable();
  },

  enableBottomButtons: function (submit) {
    var search = this;
    search.resetButton.enable();
    if (submit) {
      search.submitButton.enable();
    } else {
      search.submitButton.disable();
    }
  },

  showSimple: function () {
    var search = this;

    // enable header and form buttons
    search.enableTopButtons();
    search.enableBottomButtons(true);

    // switch panel
    search.layout.setActiveItem('simple');

    // update form
    search.update();
  },

  showGuided: function (filters) {
    var search = this;

    // enable header and form buttons
    search.enableTopButtons();
    search.enableBottomButtons();

    // switch panel
    search.layout.setActiveItem('guided');

    // update form
    search.update(filters);
  },

  showAdvanced: function (filters) {
    var search = this;

    // enable header and form buttons
    search.enableTopButtons(true);
    search.enableBottomButtons(true);

    // switch panel
    search.layout.setActiveItem('advanced');

    // update form
    search.update(filters);
  },

  isValid: function () {
    return this.layout.activeItem.getForm().isValid();
  },

  focus: function () {
    return this.layout.activeItem.focus();
  },

  update: function (filters) {
    return this.layout.activeItem.update(filters);
  }
});

Ext.reg('search', Martview.Search);
