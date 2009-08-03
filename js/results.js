Ext.namespace('Martview');

Martview.Results = Ext.extend(Ext.Panel, {

    // hard config - cannot be changed from outside
    initComponent: function () {

        // add config here
        var config = {
            id: 'results',
            region: 'center',
            title: 'Results',
            layout: 'fit',
            iconCls: 'view_icon',
            bbar: ['&nbsp;'],
            tbar: [{
                id: 'changeview',
                text: 'Select view',
                iconCls: 'view_icon',
                cls: 'x-btn-text-icon',
                disabled: true,
                menu: [{
                    text: 'Tabular',
                    iconCls: 'tabular_view_icon'
                },
                {
                    text: 'Itemized',
                    iconCls: 'itemized_view_icon'
                },
                {
                    text: 'Map',
                    iconCls: 'map_view_icon'
                }]
            },
            '-', {
                text: 'Customize view',
                itemId: 'customize',
                disabled: true,
                iconCls: 'edit_icon',
                cls: 'x-btn-text-icon'
            },
            '-', {
                text: 'Save results',
                disabled: true,
                iconCls: 'save_icon',
                cls: 'x-btn-text-icon',
                handler: function () {
                    Ext.Msg.show({
                        title: Martview.APP_TITLE,
                        msg: 'Export the results in various formats',
                        buttons: Ext.Msg.OKCANCEL,
                        icon: Ext.MessageBox.INFO,
                        fn: function (btn) {
                            if (btn == 'ok') {}
                        }
                    });
                },
                /*            },
            '-', {
                text: 'Print results',
                disabled: true,
                iconCls: 'print_icon',
                cls: 'x-btn-text-icon',
                handler: function() {
                    console.info('You clicked the "Print results" button');
                }
*/
            }]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Martview.Results.superclass.initComponent.apply(this, arguments);

    },

    clearView: function () {
        this.getTopToolbar().items.each(function (item, index) {
            item.disable();
        });
        this.getTopToolbar().findById('changeview').setText('Select view');
        this.setIconClass('view_icon');
    },

    setView: function (params) {
        this.getTopToolbar().items.each(function (item, index) {
            item.enable()
        });
        this.getTopToolbar().findById('changeview').setText('Change view');
        this.setIconClass('tabular_view_icon');
    },

});

Ext.reg('results', Martview.Results);
