Ext.namespace('Martview');

Martview.Viewport = Ext.extend(Ext.Viewport, {

  // hard config - cannot be changed from outside
  initComponent: function () {

    // add config here
    var config = {
      id: 'viewport',
      layout: 'border',
      items: [{
        xtype: 'header'
      },
      {
        xtype: 'query'
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
    Martview.Viewport.superclass.initComponent.apply(this, arguments);

  },

  // listeners
  constructor: function (config) {
    config = config || {};
    config.listeners = config.listeners || {};
    Ext.applyIf(config.listeners, {
      // add listeners here
    });

    // call parent
    Martview.Viewport.superclass.constructor.call(this, config);
  }

});
