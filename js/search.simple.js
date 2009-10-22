Ext.namespace('Martview.search');

Martview.search.Simple = Ext.extend(Ext.form.FormPanel, {

  // hard config
  initComponent: function () {
    var config = {
      padding: 10,
      bodyStyle: 'background-color:#dfe8f6;',
      labelAlign: 'top',
      defaults: {
        anchor: '100%'
      },
      items: [{
        xtype: 'textfield',
        itemId: 'search',
        ref: 'search',
        fieldLabel: 'Enter search terms',
        // labelSeparator: '',
        labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;',
        emptyText: 'Enter search terms to find specific records'
      },
      {
        // Lucene query syntax help
        xtype: 'fieldset',
        itemId: 'help',
        ref: 'help',
        title: 'Help',
        // title: '<img src="./ico/question.png" style="vertical-align: text-bottom !important;" /> <span style="font-weight: normal !important; color: #000 !important;">Help</span>',
        autoHeight: true,
        autoDestroy: true,
        defaults: {
          xtype: 'displayfield',
          anchor: '100%',
          labelStyle: 'font-weight: bold !important; font-size: 8pt !important; color: #444 !important;'
        }
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.search.Simple.superclass.initComponent.apply(this, arguments);
  },

  update: function (params) {
    params.fields = params.fields || [];

    var form = this;

    // remove fields from help fieldset
    form.help.removeAll();

    // add fields to help fieldset
    form.help.add({
      hideLabel: true,
      value: 'For more advanced searches, you can enter search terms using the <a href="http://lucene.apache.org/java/2_4_1/queryparsersyntax.html" target="_blank">Lucene query syntax</a>' + ((params.fields.length > 0) ? ' and the following fields:' : '.')
    });
    Ext.each(params.fields, function (field) {
      form.help.add({
        fieldLabel: field.name,
        value: field.description
      });
    });

    // refresh form layout and focus
    form.doLayout();
    form.reset();
  },

  reset: function () {
    var form = this;
    form.getForm().reset();
    form.focus();
  },

  focus: function () {
    var form = this;
    form.search.focus(true, true);
  },

  build: function () {
    // TODO
  }
});

Ext.reg('simplesearch', Martview.search.Simple);
