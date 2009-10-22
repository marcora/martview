Ext.namespace('Ext.ux.form');

Ext.ux.form.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
  // assume placed in grid panel toolbar
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

  onTrigger1Click: function () {
    if (this.hasSearch) {
      var store = this.ownerCt.ownerCt.getStore();
      store.clearFilter();
      try { // if grid is also a tree
        store.collapseAll();
      } catch(e) {
        // pass
      }
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

    var terms = val.split(/\s+/);

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/permute [rev. #1]
    var permute = function (v, m) {
      for (var p = -1, j, k, f, r, l = v.length, q = 1, i = l + 1; --i; q *= i);
      for (x = [new Array(l), new Array(l), new Array(l), new Array(l)], j = q, k = l + 1, i = -1; ++i < l; x[2][i] = i, x[1][i] = x[0][i] = j /= --k);
      for (r = new Array(q); ++p < q;)
      for (r[p] = new Array(l), i = -1; ++i < l; ! --x[1][i] && (x[1][i] = x[0][i], x[2][i] = (x[2][i] + 1) % l), r[p][i] = m ? x[3][i] : v[x[3][i]])
      for (x[3][i] = x[2][i], f = 0; ! f; f = !f)
      for (j = i; j; x[3][--j] == x[2][i] && (x[3][i] = x[2][i] = (x[2][i] + 1) % l, f = 1));
      return r;
    };

    // generate search regexp that matches all complete permutations of search terms
    var s = '';
    var permutations = permute(terms);
    Ext.each(permutations, function (permutation) {
      if (permutation.length == terms.length) {
        if (s.length == 0) {
          s += ('(' + permutation.join('.*'));
        } else {
          s += ('|' + permutation.join('.*'));
        }
      }
    });
    if (s.length > 0) s += ')';
    if (debug) console.log(s);
    var re = new RegExp(s, 'i');

    // filter store on fulltext using search regexp
    var store = this.ownerCt.ownerCt.getStore();
    store.filter('fulltext', re);
    try { // if grid is also a tree
      store.expandAll();
    } catch(e) {
      // pass
    }
    this.hasSearch = true;
    this.triggers[0].show();
    this.focus();
  }
});

Ext.reg('searchfield', Ext.ux.form.SearchField);
