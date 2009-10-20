Ext.namespace('Martview.search');

Martview.search.Simple = Ext.extend(Ext.form.FormPanel, {

  // soft config
  padding: 10,
  bodyStyle: 'background-color:#dfe8f6;',
  labelAlign: 'top',

  // hard config
  initComponent: function () {
    var config = {
      defaults: {
        anchor: '100%'
      },
      items: [{
        xtype: 'textfield',
        fieldLabel: 'Enter search terms',
        // labelSeparator: '',
        labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;',
        emptyText: 'Enter search terms to find specific records'
      },
      {
        // Lucene query syntax help
        xtype: 'fieldset',
        itemId: 'help',
        title: 'Help',
        // title: '<img src="./ico/question.png" style="vertical-align: text-bottom !important;" /> <span style="font-weight: normal !important; color: #000 !important;">Help</span>',
        autoHeight: true,
        //       collapsed: true,
        //       collapsible: true,
        defaultType: 'displayfield',
        defaults: {
          anchor: '100%',
          // labelSeparator: '',
          labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;'
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
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.search.Simple.superclass.initComponent.apply(this, arguments);
  },

  update: function(params) {
    var form = this;
    form.reset();
  },

  reset: function () {
    var form = this;
    form.getForm().reset();
    form.focus();
  },

  focus: function () {
    this.getForm().items.first().focus(true, true);
  }
});

Ext.reg('simplesearch', Martview.search.Simple);
