Ext.namespace('Ext.ux.form');

Ext.ux.form.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
  initComponent: function () {
    Ext.ux.form.SearchField.superclass.initComponent.call(this);
    this.on('specialkey', function (f, e) {
      if (e.getKey() == e.ENTER) {
        this.onTrigger2Click();
      }
    },
    this);
  },

  validationEvent: false,
  validateOnBlur: false,
  trigger1Class: 'x-form-clear-trigger',
  trigger2Class: 'x-form-search-trigger',
  hideTrigger1: true,
  hasSearch: false,

  onTrigger1Click: function () {},
  onTrigger2Click: function () {}
});

Ext.reg('searchfield', Ext.ux.form.SearchField);
