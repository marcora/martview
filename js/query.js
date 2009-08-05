Ext.namespace('Martview');

Martview.Query = Ext.extend(Ext.form.FormPanel, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      id: 'query',
      region: 'west',
      split: true,
      collapsible: true,
      collapseMode: 'mini',
      hideCollapseTool: true,
      width: 500,
      title: 'Query',
      iconCls: 'query_icon',
      autoScroll: true,
      padding: 10,
//       plugins: [new Ext.ux.form.FieldAutoExpand({
//         offsetFix: 0
//       })],
      labelAlign: 'top',
      bbar: [{}],
      tbar: [{
        text: 'Select form',
        id: 'selectform',
        iconCls: 'form_icon',
        cls: 'x-btn-text-icon',
        menu: []
      },
      '-', {
        text: 'Customize form',
        itemId: 'customize',
        disabled: true,
        iconCls: 'edit_icon',
        cls: 'x-btn-text-icon'
      },
      '-', {
        text: 'Save query',
        itemId: 'save',
        disabled: true,
        cls: 'x-btn-text-icon',
        iconCls: 'save_icon',
        handler: function () {
          Ext.Msg.show({
            title: Martview.APP_TITLE,
            msg: 'Export the query in various formats',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.INFO,
            fn: function (btn) {
              if (btn == 'ok') {}
            }
          });
        },
      },
      '->', {
        text: 'Reset',
        itemId: 'reset',
        disabled: true,
        iconCls: 'reset_icon',
        cls: 'x-btn-text-icon'
      },
      '-', {
        text: 'Submit',
        itemId: 'submit',
        disabled: true,
        iconCls: 'submit_icon',
        cls: 'x-btn-text-icon'
      }]
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Query.superclass.initComponent.apply(this, arguments);

  }

});

Ext.reg('query', Martview.Query);
