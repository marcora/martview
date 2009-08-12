Ext.namespace('Martview');

Martview.Main = Ext.extend(Ext.Viewport, {

  initComponent: function () {

    Ext.applyIf(this, {
      id: 'main',
      layout: 'border',
      items: [{
        xtype: 'header'
      },
      {
        xtype: 'search'
      },
      {
        xtype: 'results'
      },
      {
        xtype: 'footer'
      }]
    });

    // call parent
    Martview.Main.superclass.initComponent.apply(this, arguments);
  }
});
