Ext.namespace('Ext.ux.form');

Ext.ux.form.TreeFilterField = Ext.extend(Ext.form.TwinTriggerField, {
  // assume placed in treepanel toolbar
  initComponent: function () {
    Ext.ux.form.TreeFilterField.superclass.initComponent.call(this);
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

  onTrigger1Click: function () {
    if (this.hasSearch) {
      this.ownerCt.ownerCt.filter.clear();
      this.ownerCt.ownerCt.root.collapse(true);
      this.setValue('');
      this.hasSearch = false;
      this.triggers[0].hide();
      this.focus();
    }
  },

  onTrigger2Click: function () {
    var val = this.getRawValue().trim();
    if (val.length < 1) {
      this.onTrigger1Click();
      return;
    }
    var re = new RegExp('.*' + val + '.*', 'i');
    this.ownerCt.ownerCt.filter.clear();
    this.ownerCt.ownerCt.filter.filter(re, 'text');
    this.hasSearch = true;
    this.triggers[0].show();
    this.focus();
  }
});

Ext.reg('treefilterfield', Ext.ux.form.TreeFilterField);
