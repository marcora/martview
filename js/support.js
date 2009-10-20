// post data to another page
function post(url, data) {
  var form = document.createElement('form');
  form.method = 'post';
  form.action = url;
  form.target = '_blank';
  for (var key in data) {
    var input = document.createElement("input");
    input.setAttribute('name', key);
    input.setAttribute('type', 'hidden');
    input.setAttribute('value', data[key]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// add the capitalize method to string
String.prototype.capitalize = function () {
  return this.replace(/\w+/g, function (a) {
    return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
  });
};

// add the has method to array
Array.prototype.has = function (o) {
  return this.indexOf(o) > -1;
};

// add the get method to array
Array.prototype.get = function (i) {
  return this[i];
};

// add the first method to array
Array.prototype.first = function () {
  return this[0];
};

// add the last method to array
Array.prototype.last = function () {
  return this[this.length-1];
};

// add the moveUp and moveDn methods to Ext.util.MixedCollection
// Array.prototype.array_move = function  (int_source, int_target)
// {
//   if  (int_source < 0 || int_source >= this.length || int_target < 0 || int_target >= this.length) {
//     trace('### ERROR ###\n\targuments are not elements of the array ');
//     return false;
//   }
//   var val = this.splice(int_source, 1);
//   this.splice(int_target, 0, val);
// }
Ext.override(Ext.util.MixedCollection, {
  moveUp: function (item) {
    var pos = this.indexOf(item);
    if ((pos - 1) >= 0) {
      this.removeAt(pos);
      this.insert(pos - 1, item);
      return true;
    } else {
      return false;
    }

  },
  moveDn: function (item) {
    var pos = this.indexOf(item);
    if ((pos + 1) < this.getCount()) {
      this.removeAt(pos);
      this.insert(pos + 1, item);
      return true;
    } else {
      return false;
    }
  }
});

// add the getText method to Ext.menu.BaseItem to match the setText method
Ext.override(Ext.menu.BaseItem, {
  getText: function () {
    return this.el.child('.x-menu-item-text').dom.innerHTML;
  }
});

// add the getText method to Ext.menu.Menu to match the setText method
Ext.override(Ext.menu.Menu, {
  getText: function () {
    return this.el.child('.x-menu-item-text').dom.innerHTML;
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

// add the focus method to Ext.form.FormPanel
Ext.override(Ext.form.FormPanel, {
  focus: function () {
    try {
      if (this.items.first().isXType('fieldset')) {
        this.items.first().items.first().focus('', 200);
      } else {
        this.items.first().focus('', 200);
      }
    } catch(e) {
      // do nothing if no form fields
    }
  }
});
