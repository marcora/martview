Ext.namespace('Martview');

Martview.Attributes = Ext.extend(Ext.Window, {

    // hard config - cannot be changed from outside
    initComponent: function () {

        var loader = new Ext.tree.TreeLoader({
            dataUrl: './json/cporcellus_gene_ensembl.attributes.json'
        });
        var root = new Ext.tree.AsyncTreeNode();

        // add config here
        var config = {
            id: 'attributes',
            title: 'Customize view',
            modal: true,
            width: 700,
            height: 500,
            layout: 'border',
            border: false,
            buttons: [{
                text: 'Submit',
                disabled: true,
                handler: function () {
                    // do something here
                    this.ownerCt.ownerCt.hide();
                }
            },
            {
                text: 'Close',
                handler: function () {
                    this.ownerCt.ownerCt.hide();
                }
            }],
            items: [{
                region: 'west',
                xtype: 'treepanel',
                itemId: 'attributestree',
                rootVisible: false,
                animate: true,
                enableDD: false,
                autoScroll: true,
                containerScroll: true,
                loader: new Ext.tree.TreeLoader(),
                lines: true,
                singleExpand: true,
                // selModel: new Ext.tree.MultiSelectionModel(),
                title: 'All attributes',
                width: 330,
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                hideCollapseTool: true,
                root: root,
                loader: loader,
                deferredRender: false,
                listeners: {
                    dblclick: function (node) {
                        if (node.isLeaf()) {
                            this.ownerCt.buttons[0].enable();
                            var selattrs = Ext.getCmp('selattrs');
                            node.disable();
                            selattrs.add({
                                xtype: 'displayfield',
                                name: node.id,
                                fieldLabel: node.attributes.display_name || node.attributes.name,
                                labelSeparator: '&nbsp;<img style="vertical-align:middle;" src="./ico/delete.png" />'
                            });
                            selattrs.doLayout();
                        }
                    }
                }
            },
            {
                region: 'center',
                id: 'selattrs',
                xtype: 'form',
                labelWidth: 200,
                autoScroll: true,
                padding: 10,
                title: 'Selected attributes',
            }]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        Martview.Attributes.superclass.initComponent.apply(this, arguments);
    },

    onRender: function () {
        // call parent
        Martview.Attributes.superclass.onRender.apply(this, arguments);
    }

});

Ext.reg('attributes', Martview.Attributes);
