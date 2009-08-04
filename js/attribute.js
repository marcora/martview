Ext.namespace('Martview');

Martview.Attribute = Ext.extend(Ext.Panel, {
    name: 'name',
    display_name: 'display_name',

    frame: true,
    border: true,
    labelWidth: 75,
    title: 'Attribute',

    initComponent: function() {
        Ext.apply(this, {
            items: [{
                layout: 'form',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: '.5',
                        layout: 'form',
                        items: [{
                            xtype: 'label',
                            text: this.name
                        }]
                    },
                    {
                        columnWidth: '.5',
                        layout: 'form',
                        items: [{
                            xtype: 'label',
                            text: this.display_name
                        }]
                    }]
                }]
            }]
        });
        Martview.Attribute.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('attribute', Martview.Attribute);
