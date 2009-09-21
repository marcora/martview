Ext.namespace('Martview');

Martview.Main = Ext.extend(Ext.Viewport, {

  initComponent: function () {

    var config = {
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
    };

    // apply config
    Ext.apply(this, Ext.apply(this.initialConfig, config));

    // call parent
    Martview.Main.superclass.initComponent.apply(this, arguments);
  }
});
