Ext.namespace('Martview');

Martview.Search = Ext.extend(Ext.Panel, {
  initComponent: function () {
    Ext.applyIf(this, {
      id: 'search',
      ref: '../search',
      region: 'west',
      layout: 'fit',
      width: 500,
      split: true,
      collapsible: true,
      collapseMode: 'mini',
      hideCollapseTool: true,
      bodyStyle: 'background-color:#dfe8f6;',
      tbar: new Ext.Toolbar({
        cls: 'x-panel-header',
        height: 26,
        items: [{
          itemId: 'select',
          ref: '../selectButton',
          text: '<span style="color:#15428B; font-weight:bold">Search</span>',
          iconCls: 'simple_search_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          menu: [{
            itemId: 'simple',
            text: 'Simple',
            iconCls: 'simple_search_icon',
            checked: true,
            group: 'format'
          },
          {
            itemId: 'guided',
            text: 'Guided',
            iconCls: 'guided_search_icon',
            group: 'format'
          },
          {
            itemId: 'advanced',
            text: 'Advanced',
            iconCls: 'advanced_search_icon',
            group: 'format'
          },
          {
            itemId: 'user',
            text: 'Dimeric protein structures at high-res',
            iconCls: 'user_search_icon',
            group: 'format'
          }]
        },
        '->', {
          itemId: 'customize',
          ref: '../customizeButton',
          text: 'Add filter',
          iconCls: 'add_icon',
          cls: 'x-btn-text-icon',
          hidden: true
        },
        {
          text: 'Save',
          itemId: 'save',
          ref: '../saveButton',
          iconCls: 'save_icon',
          cls: 'x-btn-text-icon',
          disabled: true,
          handler: function () {
            Ext.MessageBox.alert(Martview.APP_TITLE, 'Save search in various formats');
          }
        }]
      }),
      bbar: ['->', {
        itemId: 'reset',
        ref: '../resetButton',
        text: 'Reset',
        iconCls: 'reset_icon',
        cls: 'x-btn-text-icon',
        disabled: true,
        handler: function () {
          this.form.getForm().reset();
          this.form.focus();
        },
        scope: this // search panel scope
      },
      {
        itemId: 'submit',
        ref: '../submitButton',
        text: 'Submit',
        iconCls: 'submit_icon',
        cls: 'x-btn-text-icon',
        disabled: true
      }],
      items: [{
        xtype: 'form',
        itemId: 'form',
        ref: 'form',
        border: false,
        padding: 10,
        labelAlign: 'top',
        autoScroll: true,
        bodyStyle: 'background-color:#dfe8f6;'
      }]
    });

    // call parent
    Martview.Search.superclass.initComponent.apply(this, arguments);
  },

  enableHeaderButtons: function (customize) {
    var search = this;
    search.selectButton.enable();
    if (customize) search.customizeButton.show();
    search.saveButton.enable();
  },

  enableFormButtons: function () {
    var search = this;
    search.resetButton.enable();
    search.submitButton.enable();
  },

  showSimpleForm: function () {
    var search = this;
    var form = this.form;

    // enable header buttons
    this.enableHeaderButtons();

    // remove all fields from search form
    form.removeAll();

    // add field to search form
    form.add([{
      xtype: 'textfield',
      anchor: '100%',
      fieldLabel: 'Enter search terms'
    },
    {
      // Lucene query syntax help
      xtype: 'fieldset',
      title: '<img src="./ico/question.png" style="vertical-align: text-bottom !important;" /> <span style="font-weight: normal !important; color: #000 !important;">Help</span>',
      autoHeight: true,
      //       collapsed: true,
      //       collapsible: true,
      defaultType: 'displayfield',
      defaults: {
        labelStyle: 'font-weight: bold;'
      },
      items: [{
        hideLabel: true,
        value: 'For more advanced searches, you can enter search terms using the <a href="http://lucene.apache.org/java/2_4_1/queryparsersyntax.html" target="_blank">Lucene query syntax</a> and the following fields:'
      },
      {
        fieldLabel: 'pdb_id',
        value: 'search by PDB ID (for example, <code>pdb_id:11ba</code>)'
      },
      {
        fieldLabel: 'experiment_type',
        value: 'search by experiment type (for example, <code>experiment_type:NMR</code>)'
      },
      {
        fieldLabel: 'resolution',
        value: 'search by resolution (for example, <code>resolution:[3 TO *]</code>)'
      },
      {
        fieldLabel: 'authors',
        value: 'search by author name (for example, <code>authors:Mishima</code>)'
      }]
    }]);

    // refresh form layout and focus
    form.doLayout();
    form.focus();
  },

  showGuidedForm: function (facets) {
    var search = this;
    var form = search.form;

    // enable header buttons
    this.enableHeaderButtons();

    // disable submit button
    search.submitButton.disable();

    // remove all fields from search form
    // FIXME: this is way to intricate and indeed it's a bug that should be fixed in Ext v3.1
    form.items.clear();
    form.getForm().items.each(function (field) {
      field.destroy();
    });

    // add fields to search form
    if (facets) {
      form.add(facets);
    }

    // refresh form layout and focus
    form.doLayout();
    form.focus();
  },

  showAdvancedForm: function (filters) {
    var search = this;
    var form = search.form;

    // enable header buttons
    this.enableHeaderButtons(true);

    // remove all fields from search form
    form.removeAll();

    // add fields to search form
    var field;
    Ext.each(filters, function (filter) {
      if (filter.qualifier in {
        '=': '',
        '>': '',
        '<': ''
      }) {
        if (filter.options) {
          field = form.add([{
            xtype: 'combo',
            anchor: '100%',
            name: filter.name,
            fieldLabel: filter.display_name || filter.name,
            editable: false,
            forceSelection: true,
            lastSearchTerm: false,
            triggerAction: 'all',
            mode: 'local',
            store: filter.options.split(',')
          }]);
        } else {
          field = form.add([{
            xtype: 'textfield',
            anchor: '100%',
            name: filter.name,
            fieldLabel: filter.display_name || filter.name
          }]);
        }
      } else if (filter.qualifier in {
        'in': ''
      }) {
        field = form.add({
          xtype: 'textfield',
          anchor: '100%',
          name: filter.name,
          fieldLabel: filter.display_name || filter.name
        });
      }
      // set field value if defined
      if (filter.value) field.setValue(filter.value);
    });

    // refresh form layout and focus
    form.doLayout();
    form.focus();
  }

});

Ext.reg('search', Martview.Search);
