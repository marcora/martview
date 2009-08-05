Ext.namespace('Martview');

Martview.Loading = Ext.extend(Ext.Window, {
  id: 'loading',
  title: Martview.APP_TITLE,
  modal: true,
  height: 400,
  width: 300,
  html: 'biomart loading'
});

Ext.reg('loading', Martview.Loading);

Martview.Help = Ext.extend(Ext.Window, {
  id: 'help',
  title: Martview.APP_TITLE,
  modal: true,
  height: 400,
  width: 300,
  html: 'biomart help'
});

Ext.reg('help', Martview.Help);
