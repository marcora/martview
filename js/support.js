// add the getText method to Ext.menu.item to match the setText method
Ext.override(Ext.menu.BaseItem, {
  getText: function () {
    return this.el.select('span.x-menu-item-text').first().dom.innerHTML;
  }
});

// add the getText method to Ext.menu.Menu to match the setText method
Ext.override(Ext.menu.Menu, {
  getText: function () {
    return this.el.select('span.x-menu-item-text').first().dom.innerHTML;
  }
});

// make form.removeAll() work the right way <http://extjs.com/forum/showthread.php?p=120152#post120152>
Ext.override(Ext.layout.FormLayout, {
  renderItem: function (c, position, target) {
    if (c && !c.rendered && (c.isFormField || c.fieldLabel) && c.inputType != 'hidden') {
      var args = this.getTemplateArgs(c);
      if (typeof position == 'number') {
        position = target.dom.childNodes[position] || null;
      }
      if (position) {
        c.itemCt = this.fieldTpl.insertBefore(position, args, true);
      } else {
        c.itemCt = this.fieldTpl.append(target, args, true);
      }
      c.actionMode = 'itemCt';
      c.render('x-form-el-' + c.id);
      c.container = c.itemCt;
      c.actionMode = 'container';
    } else {
      Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
    }
  }
});

Ext.override(Ext.form.Field, {
  getItemCt: function () {
    return this.itemCt;
  }
});
