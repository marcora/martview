// FIXME: Attributes with the same name are included in results even if not selected
//        Disambiguate attribute name by its position in hierarchy!
//        Look for or code 'find by uuid' in both extjs tree and ruby collection of attributes on server side
// FIXME: Do not reload search/results when user select same search/results as current
// TODO:  Column order for query results should follow attribute order
// TODO:  Do not resubmit search to server when changing results format
// FIXME: Search form customization does not work when search format is set to 'user'
try {
  console.log(); // http://code.google.com/p/fbug/issues/detail?id=1014
  var debug = true;
} catch(e) {
  var debug = false;
}

Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.chart.Chart.CHART_URL = './ext/resources/charts.swf';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Ext.namespace('Martview');

Ext.onReady(function () {

  /* ==============
     Initialization
     ============== */

  // init tips
  Ext.QuickTips.init();

  // init viewport, dialogs, windows and global state vars
  var main = new Martview.Main(); // application viewport
  var form = main.search.form; // search form
  var data; // container for results
  var loading = new Martview.windows.Loading(); // loading window
  var flash = new Martview.windows.Flash(); // flash window
  var filters_win, attributes_win; // filters/attributes windows
  var reset_filters_win_to_defaults = true;
  var reset_attributes_win_to_defaults = true;
  var default_filters, default_attributes;

  // init ajax connection
  var conn = new Ext.data.Connection({
    timeout: 120000,
    listeners: {
      beforerequest: function () {
        loading.show();
      },
      requestcomplete: function () {
        loading.hide();
        // main.footer.updateMessageIfError('info', Martview.SAVE_RESULTS_MSG);
      },
      requestexception: function () {
        loading.hide();
        // main.footer.updateMessage('error', Martview.CONN_ERROR_MSG);
        // flash.show('error', Martview.CONN_ERROR_MSG);
        // alert(Martview.CONN_ERROR_MSG);
        Ext.Msg.show({
          title: Martview.APP_TITLE,
          msg: Martview.CONN_ERROR_MSG,
          // icon: Ext.Msg.ERROR,
          buttons: Ext.Msg.OK,
          width: 300
        });
      }
    }
  });

  // extract query params
  var params = Ext.urlDecode(window.location.search.substring(1));

  // if not specified the default search is 'advanced' and the default results is 'tabular'
  Ext.applyIf(params, {
    search: 'advanced',
    results: 'tabular'
  });

  // populate select dataset menu with data from server
  var select_dataset_menu_url = './json/select_dataset_menu.json';
  conn.request({
    url: select_dataset_menu_url,
    success: function (response) {
      var select_dataset_menu_data = Ext.util.JSON.decode(response.responseText);
      main.header.load(select_dataset_menu_data, selectSearch);
      main.footer.updateMessage('info', 'To begin, please select the database you want to search');
      params.mart_name = params.mart;
      params.dataset_name = params.dataset;

      // validate query params by recursively matching with the select dataset menu items
      var dataset_counter = 0;
      var single_dataset;
      function validateParams(menu) {
        menu.items.each(function (menu_item) {
          if (menu_item.menu) {
            validateParams(menu_item.menu);
          } else {
            dataset_counter++;
            single_dataset = menu_item;
            if (params.mart_name == menu_item.mart_name && params.dataset_name == menu_item.dataset_name && Martview.ALLOWED_SEARCH_PARAMS.has(params.search) && Martview.ALLOWED_RESULTS_PARAMS.has(params.results)) {
              params.mart_display_name = menu_item.mart_display_name || menu_item.mart_name;
              params.dataset_display_name = menu_item.dataset_display_name || menu_item.dataset_name;
            }
          }
        });
      }
      validateParams(main.header.homeButton.menu);

      // call select search if params are valid
      if (params.dataset_display_name) {
        selectSearch(params);
      } else if (dataset_counter == 1) {
        // if only one dataset on server and even if not specified in params, select it automagically
        selectSearch(single_dataset); // or window.location.search = 'mart=' + single_dataset.mart_name + '&dataset=' + single_dataset.dataset_name;
      } else {
        // pass and wait for select dataset menu click event
        main.header.homeButton.getEl().highlight('e0e8f3', {
          endColor: 'ffcc66'
        }).highlight('ffcc66', {
          endColor: 'dfe8f6'
        }).highlight('dfe8f6', {
          endColor: 'ffcc66'
        }).highlight('ffcc66', {
          endColor: 'dfe8f6'
        }).highlight('dfe8f6', {
          endColor: 'ffcc66'
        }).highlight('ffcc66', {
          endColor: 'dfe8f6'
        }).highlight('dfe8f6', {
          endColor: 'ffcc66'
        }).highlight('ffcc66', {
          endColor: 'dfe8f6'
        });
      }
    }
  });

  /* =================
     Utility functions
     ================= */

  // extract array of default fields from tree
  function extractDefaultFields(tree, default_fields, include_fields) {
    Ext.each(tree, function (node) {
      if (node['leaf']) {
        if (include_fields) {
          if (node['name'] in include_fields) {
            var value = include_fields[node['name']];
            if (value) node['value'] = value;
            default_fields.push(node);
          }
        } else {
          if (node['default']) {
            default_fields.push(node);
          }
        }
      } else {
        extractDefaultFields(node['children'], default_fields, include_fields);
      }
    });
  }

  // parse query string for fields to include and return them as a key-value hash
  function parseIncludeFields(include_fields) {
    var parsed = new Object;
    Ext.each(include_fields.split('|'), function (include_field) {
      var name_value = include_field.split(':');
      parsed[name_value[0]] = name_value[1];
    });
    return parsed;
  }

  // build query xml based of selected filters and attributes
  function buildQueryXml(values) {
    var dataset_filters = [];
    form.filters.items.each(function (item) {
      if (item.isXType('radiogroup')) {
        try {
          dataset_filters.push({
            name: item.getName(),
            excluded: (item.getValue().getGroupValue() == 'excluded') ? 1 : 0
          });
        } catch(e) {
          // pass in case no radio is selected
        }
      } else if (item.isXType('fileuploadfield')) {
        // pass for now
      } else if (item.isXType('textarea')) {
        var list = item.getValue().split('\n').join(',');
        if (list) {
          dataset_filters.push({
            name: item.getName(),
            value: list
          });
        }
      } else if (item.isXType('textfield') || item.isXType('combo')) {
        if (item.getValue().trim()) {
          dataset_filters.push({
            name: item.getName(),
            value: item.getValue().trim()
          });
        }
      }
    });
    var dataset_attributes = [];
    if (attributes_win.rendered) {
      attributes_win.get('selected').items.each(function (item) {
        dataset_attributes.push({
          name: item.treenode.attributes.name
        });
      });
    } else {
      Ext.each(default_attributes, function (default_attribute) {
        dataset_attributes.push({
          name: default_attribute.name
        });
      });
    }
    values = values || new Object;
    Ext.applyIf(values, {
      virtualSchemaName: 'default',
      formatter: 'CSV',
      header: 0,
      uniqueRows: 1,
      count: 0,
      limitSize: 100,
      datasetConfigVersion: '0.6',
      datasetInterface: 'default',
      datasetName: params.dataset_name,
      datasetFilters: dataset_filters,
      datasetAttributes: dataset_attributes
    });
    // TODO: raise if datasetName is null!
    var tpl = new Ext.XTemplate('<?xml version="1.0" encoding="UTF-8"?>', //
    '<!DOCTYPE Query>', //
    '<Query virtualSchemaName="{virtualSchemaName}" formatter="{formatter}" header="{header}" uniqueRows="{uniqueRows}" count="{count}" limitSize="{limitSize}" datasetConfigVersion="{datasetConfigVersion}">', //
    '<Dataset name="{datasetName}" interface="{datasetInterface}">', //
    '<tpl for="datasetFilters">', //
    '<tpl if="typeof(value) == \'undefined\'">', //
    '<Filter name="{name}" excluded="{excluded}"/>', //
    '</tpl>', //
    '<tpl if="typeof(excluded) == \'undefined\'">', //
    '<Filter name="{name}" value="{value}"/>', //
    '</tpl>', //
    '</tpl>', //
    '<tpl for="datasetAttributes">', //
    '<Attribute name="{name}"/>', //
    '</tpl>', //
    '</Dataset>', //
    '</Query>');
    var xml = tpl.apply(values);
    return xml;
  }

  /* ==============
     Event bindings
     ============== */

  // show filters window on customize button click
  main.search.customizeButton.on('click', function () {
    filters_win.show();
    if (reset_filters_win_to_defaults) filters_win.resetToDefaultFields();
    reset_filters_win_to_defaults = false;
    filters_win.rememberCurrentFields();
  });

  // show attributes window on customize button click
  main.results.customizeButton.on('click', function () {
    attributes_win.show();
    if (reset_attributes_win_to_defaults) attributes_win.resetToDefaultFields();
    reset_attributes_win_to_defaults = false;
    attributes_win.rememberCurrentFields();
  });

  // submit search on submit button click
  main.search.submitButton.on('click', function () {
    submitSearch();
  });

  // select search format on search menu click
  main.search.selectButton.menu.on('itemclick', function (item) {
    params.search = item.getItemId();
    selectSearch(params);
  });

  // select results format on results menu click
  main.results.selectButton.menu.on('itemclick', function (item) {
    params.results = item.getItemId();
    main.results.selectButton.setIconClass(params.results + '-results-icon');
    main.results.load(data, params.results);
  });

  /* ==============
     Event handlers
     ============== */

  /* --------------------
     select search action
     -------------------- */
  function selectSearch(menu_item) {
    // if called from menu
    if (menu_item) params = menu_item;

    // if not specified the default search format is 'advanced' and the default results format is 'tabular'
    Ext.applyIf(params, {
      search: 'advanced',
      results: 'tabular'
    });

    // clear search/results panel, if present
    try {
      main.results.clear();
      // reset search form w/o submit
      main.search.form.reset(false); // the appropriate reset method is attached to form at render time
    } catch(e) {
      // pass
    }

    // update breadcrumbs
    main.header.updateBreadcrumbs(params);

    // set search format icon
    main.search.selectButton.setIconClass(params.search + '-search-icon');

    // set results format icon
    main.results.selectButton.setIconClass(params.results + '-results-icon');

    // assign save search button handler
    main.search.saveButton.setHandler(function () {
      // show save search dialog
      var dialog = new Martview.windows.SaveSearch();
      dialog.show();
      dialog.center();
      dialog.saveButton.on('click', function () {
        // post save request to martservice
        var params = {
          type: 'savesearch',
          xml: buildQueryXml({
            formatter: dialog.form.format.getValue().toUpperCase(),
            limitSize: 0
          })
        };
        post('../martservice', params);
        this.destroy();
      },
      dialog);
    });

    // assign save results button handler
    main.results.saveButton.setHandler(function () {
      // show save search dialog
      var dialog = new Martview.windows.SaveResults();
      dialog.show();
      dialog.center();
      dialog.saveButton.on('click', function () {
        // post save request to martservice
        var params = {
          type: 'saveresults',
          xml: buildQueryXml({
            formatter: dialog.form.format.getValue().toUpperCase(),
            limitSize: 0
          })
        };
        post('../martservice', params);
        this.destroy();
      },
      dialog);
    });

    // reset filters and attributes
    default_filters = [];
    default_attributes = [];
    reset_filters_win_to_defaults = true; // is this necessary since later window is destroyed?
    reset_attributes_win_to_defaults = true; // is this necessary since later window is destroyed?
    if (filters_win) filters_win.destroy();
    if (attributes_win) attributes_win.destroy();

    // init filters and attributes windows
    var dataset_url = './json/' + params.mart_name + '.' + params.dataset_name + '.json';

    conn.request({
      url: dataset_url,
      success: function (response) {
        var dataset = Ext.util.JSON.decode(response.responseText);

        // TODO: this is a mock implementation of user-defined searches
        if (params.search == 'user') {
          var include_filters = parseIncludeFields('assembly_type:DIMERIC|resolution_less_than:2|resolution_more_than:0');
        }

        // filters
        if (params.filters) {
          var include_filters = parseIncludeFields(params.filters);
        }
        extractDefaultFields(dataset.filters, default_filters, include_filters);
        filters_win = new Martview.windows.Fields({
          id: 'filters',
          title: 'Add filter to search form',
          display_name: 'Filters',
          field_iconCls: 'filter-icon',
          children: dataset.filters,
          default_fields: default_filters
        });
        filters_win.on('hide', function () {
          if (filters_win.fields_changed) updateSearch(false);
        });

        // attributes
        if (params.attributes) {
          var include_attributes = parseIncludeFields(params.attributes);
        }
        extractDefaultFields(dataset.attributes, default_attributes, include_attributes);
        attributes_win = new Martview.windows.Fields({
          id: 'attributes',
          title: 'Add column to results grid',
          display_name: 'Columns',
          field_iconCls: 'attribute-icon',
          children: dataset.attributes,
          default_fields: default_attributes
        });
        attributes_win.on('hide', function () {
          if (attributes_win.fields_changed) submitSearch();
        });

        // call update search
        updateSearch(true);
      }
    });
  }

  /* --------------------
     update search action
     -------------------- */
  function updateSearch(submit) {

    // add fields to search form
    if (params.search == 'simple') {
      showSimpleSearch();
    } else if (params.search == 'guided') {
      showGuidedSearch();
    } else if (params.search == 'advanced' || params.search == 'user') {
      if (filters_win.rendered) {
        var filters = [];
        filters_win.selected.items.each(function (item) {
          filters.push(item.treenode.attributes);
        });
      } else {
        var filters = default_filters.slice(); // copy not ref!
      }

      // add values to filters if previously set in the search form
      var values = form.getForm().getValues();
      Ext.each(filters, function (filter) {
        var value = values[filter.name];
        if (value) filter['value'] = value;
      });

      showAdvancedSearch(filters);
      if (submit) submitSearch();
    }
  }

  /* -------------------------
     show simple search action
     ------------------------- */
  function showSimpleSearch() {
    // reset form
    function resetSimpleSearch() {
      main.results.clear();
      form.getForm().reset();
      form.focus();
    }

    // update footer message
    main.footer.updateMessage('info', 'Enter search terms and then press the Enter key or the Submit button to fetch the results');

    // hide customize results button
    main.results.customizeButton.hide();

    // clear results
    main.results.clear();

    // show simple form
    main.search.showSimpleForm();

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(resetSimpleSearch);

    // reassign reset form method
    form.reset = resetSimpleSearch;

    // submit search on enter key
    form.items.first().on('specialkey', function (f, o) {
      if (o.getKey() == 13) {
        submitSearch();
      }
    });
  }

  /* -------------------------
     show guided search action
     ------------------------- */
  function showGuidedSearch(facets) {
    // reset form
    function resetGuidedSearch(submit) {
      form.filters.items.each(function (item) {
        if (item.xtype == 'facetfield') {
          form.filters.add({
            xtype: 'unfacetfield',
            name: item.getName(),
            value: item.getValue()
          });
        }
      });
      // default submit to true
      submit = typeof(submit) == 'undefined' ? true : submit;
      if (submit) submitSearch();
    }

    // update footer message
    main.footer.updateMessage('info', 'Use the drop-down boxes to make the search more specific and narrow the results');

    // hide customize results button
    main.results.customizeButton.hide();

    // show guided form
    main.search.showGuidedForm(facets);

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(resetGuidedSearch);

    // reassing reset form method
    form.reset = resetGuidedSearch;

    // add handlers to combo/facet fields
    if (facets) {
      form.filters.items.each(function (item) {
        if (item.xtype == 'combo') {
          item.on('select', function (item) {
            form.filters.add({
              xtype: 'hidden',
              name: item.getName(),
              value: item.getValue()
            });
            submitSearch();
          });
        } else if (item.xtype == 'facetfield') {
          item.on('triggerclick', function (item) {
            form.filters.add({
              xtype: 'unfacetfield',
              name: item.getName(),
              value: item.getValue()
            });
            submitSearch();
          });
        }
      });
    } else {
      submitSearch();
    }
  }

  /* ---------------------------
     show advanced search action
     --------------------------- */
  function showAdvancedSearch(filters) {
    // reset form
    function resetAdvancedSearch(submit) {
      form.filters.items.each(function (item) {
        try {
          item.reset();
          item.setValue('');
        } catch(e) {
          // pass
        }
      }); // form.getForm().reset(); doesnt quite work for some reason!
      form.focus();
      // default submit to true
      submit = typeof(submit) == 'undefined' ? true : submit;
      if (submit) submitSearch();
    }

    // update footer message
    main.footer.updateMessage('info', 'Press the Submit button to fetch the results. Add filters to the search form to make the search more specific and narrow the results');

    // show customize results button
    main.results.customizeButton.show();

    // show advanced search form
    main.search.showAdvancedForm(filters);

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(resetAdvancedSearch);

    // reassing reset form method
    form.reset = resetAdvancedSearch;

    // submit key on enter key
    form.filters.items.each(function (item) {
      item.on('specialkey', function (f, o) {
        if (o.getKey() == 13) {
          submitSearch();
        }
      });
    });
  }

  /* --------------------
     submit search action
     -------------------- */
  function submitSearch() {
    // validate form
    if (!form.getForm().isValid()) return;

    // build search params
    var search_params = new Object;
    if (params.search == 'simple') {
      var query = form.items.first().getValue().trim(); // FIXME: too verbose!
      if (!query) return; // abort submit if no search terms
      Ext.apply(search_params, {
        type: 'search',
        q: query
      });
    } else if (params.search == 'guided') {
      var filters = [];
      form.filters.items.each(function (item) {
        var filter = {
          name: item.getName(),
          value: item.getValue()
        };
        if (item.xtype in {
          'hidden': '',
          'facetfield': ''
        }) {
          filters.push(filter.name + ':' + filter.value);
        }
      });
      form.filters.items.each(function (item) {
        var filter = {
          name: item.getName(),
          value: item.getValue()
        };
        if (item.xtype in {
          'unfacetfield': ''
        }) {
          filters.remove(filter.name + ':' + filter.value);
        }
      });
      Ext.apply(search_params, {
        type: 'search',
        q: '*:*',
        facet_fields: 'experiment_type|resolution|space_group|r_work',
        filters: filters.join('|')
      });
    } else if (params.search == 'advanced' || params.search == 'user') {
      var xml = buildQueryXml();
      Ext.apply(search_params, {
        type: 'query',
        xml: xml
      });
    }

    // log search params
    if (debug) console.dir(search_params);

    // submit query
    conn.request({
      url: '../martservice',
      params: search_params,
      success: function (response) {
        data = Ext.util.JSON.decode(response.responseText);
        if (debug) console.dir(data);

        // build guided search form
        if (params.search == 'guided') {
          showGuidedSearch(data.facets);
        }
        form.focus();

        // load data into results panel
        main.results.load(data, params.results);
      },
      failure: function () {
        form.focus();
      }
    });
  }
});
