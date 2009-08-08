Ext.namespace('Martview');

Martview.Search = Ext.extend(Ext.form.FormPanel, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      id: 'search',
      region: 'west',
      split: true,
      collapsible: true,
//       collapseMode: 'mini',
//       hideCollapseTool: true,
      width: 500,
      iconCls: 'search_icon',
      title: 'Search',
      tools: [{
        id: 'save',
        qtip: 'Save the search'
      }],
      autoScroll: true,
      padding: 10,
      //frame: true,
      bodyStyle: 'background-color:#dfe8f6;',
      //       plugins: [new Ext.ux.form.FieldAutoExpand({
      //         offsetFix: 0
      //       })],
      labelAlign: 'top',
      tbar: [{
        text: 'Select form',
        id: 'selectform',
        disabled: false,
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
        //       },
        //       '->', {
        //         text: 'Save',
        //         itemId: 'save',
        //         disabled: true,
        //         cls: 'x-btn-text-icon',
        //         iconCls: 'save_icon',
        //         handler: function () {
        //           Ext.Msg.show({
        //             title: Martview.APP_TITLE,
        //             msg: 'Export the search in various formats',
        //             buttons: Ext.Msg.OKCANCEL,
        //             icon: Ext.MessageBox.INFO,
        //             fn: function (btn) {
        //               if (btn == 'ok') {}
        //             }
        //           });
        //         }
      }],
      bbar: ['->', {
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
    Martview.Search.superclass.initComponent.apply(this, arguments);

  }

});

Ext.reg('search', Martview.Search);
