Ext.namespace('Martview');

Martview.Filters = Ext.extend(Ext.Window, {
    id: 'filters',
    title: Martview.APP_TITLE,
    modal: true,
    height: 400,
    width: 300,
    html: 'filters'
});

Ext.reg('filters', Martview.Filters);
