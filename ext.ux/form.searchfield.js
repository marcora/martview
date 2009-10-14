// http://www.thinksharp.org/javascript-rails-like-pluralize-function/
Inflector = {
  Inflections: {
    plural: [[/(quiz)$/i, "$1zes"], [/^(ox)$/i, "$1en"], [/([m|l])ouse$/i, "$1ice"], [/(matr|vert|ind)ix|ex$/i, "$1ices"], [/(x|ch|ss|sh)$/i, "$1es"], [/([^aeiouy]|qu)y$/i, "$1ies"], [/(hive)$/i, "$1s"], [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"], [/sis$/i, "ses"], [/([ti])um$/i, "$1a"], [/(buffal|tomat)o$/i, "$1oes"], [/(bu)s$/i, "$1ses"], [/(alias|status)$/i, "$1es"], [/(octop|vir)us$/i, "$1i"], [/(ax|test)is$/i, "$1es"], [/s$/i, "s"], [/$/, "s"]],
    singular: [[/(quiz)zes$/i, "$1"], [/(matr)ices$/i, "$1ix"], [/(vert|ind)ices$/i, "$1ex"], [/^(ox)en/i, "$1"], [/(alias|status)es$/i, "$1"], [/(octop|vir)i$/i, "$1us"], [/(cris|ax|test)es$/i, "$1is"], [/(shoe)s$/i, "$1"], [/(o)es$/i, "$1"], [/(bus)es$/i, "$1"], [/([m|l])ice$/i, "$1ouse"], [/(x|ch|ss|sh)es$/i, "$1"], [/(m)ovies$/i, "$1ovie"], [/(s)eries$/i, "$1eries"], [/([^aeiouy]|qu)ies$/i, "$1y"], [/([lr])ves$/i, "$1f"], [/(tive)s$/i, "$1"], [/(hive)s$/i, "$1"], [/([^f])ves$/i, "$1fe"], [/(^analy)ses$/i, "$1sis"], [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis"], [/([ti])a$/i, "$1um"], [/(n)ews$/i, "$1ews"], [/s$/i, ""], [/$/i, ""]],
    irregular: [['move', 'moves'], ['sex', 'sexes'], ['child', 'children'], ['man', 'men'], ['person', 'people']],
    uncountable: ["sheep", "fish", "series", "species", "money", "rice", "information", "equipment"]
  },
  ordinalize: function (number) {
    if (11 <= parseInt(number) % 100 && parseInt(number) % 100 <= 13) {
      return number + "th";
    } else {
      switch (parseInt(number) % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
      }
    }
  },

  singularize: function (word) {
    for (var i = 0; i < Inflector.Inflections.uncountable.length; i++) {
      var uncountable = Inflector.Inflections.uncountable[i];
      if (word.toLowerCase() == uncountable) {
        return uncountable;
      }
    }
    for (var i = 0; i < Inflector.Inflections.irregular.length; i++) {
      var singular = Inflector.Inflections.irregular[i][0];
      var plural = Inflector.Inflections.irregular[i][1];
      if ((word.toLowerCase() == plural) || (word.toLowerCase() == singular)) {
        return singular;
      }
    }
    for (var i = 0; i < Inflector.Inflections.singular.length; i++) {
      var regex = Inflector.Inflections.singular[i][0];
      var replace_string = Inflector.Inflections.singular[i][1];
      if (regex.test(word)) {
        return word.replace(regex, replace_string).toLowerCase();
      }
    }
  },

  pluralize: function (word) {
    for (var i = 0; i < Inflector.Inflections.uncountable.length; i++) {
      var uncountable = Inflector.Inflections.uncountable[i];
      if (word.toLowerCase() == uncountable) {
        return uncountable;
      }
    }
    for (var i = 0; i < Inflector.Inflections.irregular.length; i++) {
      var singular = Inflector.Inflections.irregular[i][0];
      var plural = Inflector.Inflections.irregular[i][1];
      if ((word.toLowerCase() == singular) || (word.toLowerCase() == plural)) {
        return plural;
      }
    }
    for (var i = 0; i < Inflector.Inflections.plural.length; i++) {
      var regex = Inflector.Inflections.plural[i][0];
      var replace_string = Inflector.Inflections.plural[i][1];
      if (regex.test(word)) {
        return word.replace(regex, replace_string).toLowerCase();
      }
    }
  }
}

function ordinalize(number) {
  return Inflector.ordinalize(number);
}

function pluralize(word) {
  return Inflector.pluralize(word);
}

function singularize(word) {
  return Inflector.singularize(word);
}

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

  onTrigger1Click: function () {
    if (this.hasSearch) {
      var store = this.ownerCt.ownerCt.items.last().getStore();
      store.clearFilter();
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

    var terms = val.split(' ');
    var store = this.ownerCt.ownerCt.items.last().getStore();
    if (terms.length > 1) {
      store.filterBy(function (record, id) {
        var all_terms_found = true;
        Ext.each(terms, function (term) {
          var term_found = false;
          term = term.trim();
          var re = new RegExp('.*(' + term + '|' + singularize(term) + '|' + pluralize(term) + ').*', 'i');
          term_found = re.test(record.data.fulltext);
          all_terms_found = all_terms_found && term_found; // default search logic is AND
        });
        return all_terms_found;
      });
    } else {
      var term = terms[0].trim();
      var re = new RegExp('.*(' + term + '|' + singularize(term) + '|' + pluralize(term) + ').*', 'i');
      store.filter('fulltext', re);
    };
    this.hasSearch = true;
    this.triggers[0].show();
    this.focus();
  }
});

Ext.reg('searchfield', Ext.ux.form.SearchField);
