// FIXME: Attributes with the same name are included in results even if not selected
//        Disambiguate attribute name by its position in hierarchy!
//        Look for or code 'find by uuid' in both extjs tree and ruby collection of attributes on server side
// FIXME: Do not reload search/results when user select same search/results as current
// TODO:  Column order for query results should follow attribute order
// TODO: Logged in users can mark datasets as favorites
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
  Ext.apply(Ext.QuickTips.getQuickTip(), {
    autoWidth: true,
    maxWidth: 500
  });

  // service, viewport, and windows global vars
  var service = new Martview.Service();
  var main = new Martview.Main();
  var datasets_win;
  var filters_win;
  var attributes_win;

  // init params global var with query params
  var params = Ext.urlDecode(window.location.search.substring(1));

  // transform filters param into selected_filters param
  (function () {
    var filters = [];
    if (params.filters) {
      Ext.each(params.filters.split('|'), function (filter) {
        filters.push({
          id: filter.split(':').first(),
          value: filter.split(':').last()
        });
      });
    }
    params.filters = filters;
  })();

  // transform attributes param into selected_attributes param
  (function () {
    var attributes = [];
    if (params.attributes) {
      Ext.each(params.attributes.split('|'), function (attribute) {
        attributes.push({
          id: attribute
        });
      });
    }
    params.attributes = attributes;
  })();

  // if not specified the default search is 'advanced' and the default results is 'tabular'
  Ext.applyIf(params, {
    search: 'advanced',
    results: 'tabular'
  });

  /* ==============
     Event handlers
     ============== */

  service.on('load', function (datasets) {
    // exit if empty datasets
    if (service.datasets.rows.length == 0) return;

    // create datasets window
    datasets_win = new Martview.windows.Datasets({
      datasets: datasets
    });

    // show datasets window on header select button click
    main.header.on('select', function () {
      datasets_win.show();
    });

    // load dataset on datasets window select
    datasets_win.on('select', function (dataset) {
      service.select(dataset);
    });

    // if only one dataset select bypassing datasets window
    if (service.datasets.rows.length == 1) {
      service.load(datasets.rows[0]);
      return;
    }

    // validate params against datasets and if correct select bypassing datasets window
    if (params.mart && params.dataset) {
      var valid = false;
      var dataset = {};
      Ext.each(service.datasets.rows, function (row) {
        if (row.mart_name == params.mart && row.dataset_name == params.dataset) {
          valid = true;
          Ext.apply(dataset, row);
        }
      });
      if (valid) {
        service.select(dataset);
        return;
      }
    }

    // show datasets window if nothing else worked
    datasets_win.show();
  });

  service.on('select', function (dataset) {

    // create filters window
    filters_win = new Martview.windows.Fields({
      id: 'filters',
      title: 'Add filters to search form',
      display_name: 'filters',
      field_iconCls: 'filter-icon',
      dataset: dataset,
      selected_fields: params.filters
    });

    // create attributes window
    attributes_win = new Martview.windows.Fields({
      id: 'attributes',
      title: 'Add columns to results grid',
      display_name: 'columns',
      field_iconCls: 'attribute-icon',
      dataset: dataset,
      selected_fields: params.attributes
    });

    // update search on filters window update
    filters_win.on('update', function () {
      main.search.fireEvent('select', params);
    });

    // update results on attributes window update
    // filters_win.on('update', function () {
    //   main.search.fireEvent('select', params);
    // });
    // show filters window on search customize button click
    main.search.on('customize', function () {
      filters_win.show();
    });

    // show attributes window on results customize button click
    main.results.on('customize', function () {
      attributes_win.show();
    });

    // update params with dataset data
    Ext.apply(params, service.dataset);

    // update header
    main.header.update(params);

    // select search
    main.search.select(params);
  });

  main.search.on('select', function (params) {
    // update params with dataset and filters/attributes data
    Ext.apply(params, service.dataset);
    Ext.apply(params, {
      filters: filters_win.getSelectedFields(),
      attributes: attributes_win.getSelectedFields()
    });

    // update search
    main.search.update(params);
  });

  main.search.on('update', function () {
    main.search.fireEvent('submit');
  });

  main.search.on('reset', function () {
    main.search.fireEvent('submit');
  });

  main.search.on('submit', function () {
    // update params with dataset and filters/attributes data
    Ext.apply(params, service.dataset);
    Ext.apply(params, {
      filters: filters_win.getSelectedFields(),
      attributes: attributes_win.getSelectedFields()
    });

    // build search params
    var search_params = main.search.build(params);
    if (debug) {
      console.info('Search params:');
      console.dir(search_params);
    }

    // submit search
    service.search(search_params);
  });

  service.on('search', function (results) {
    if (debug) {
      console.info('Search results:');
      console.dir(results);
    }
    // main.results.update(results);
  });

  main.results.on('select', function (params) {
    // TODO
  });

  main.results.on('update', function () {
    // TODO
  });

  main.results.on('clear', function () {
    // TODO
  });

  // load all datasets to start app
  service.load();

  return;

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

    // clear results panel, if present
    try {
      main.results.clear();
    } catch(e) {
      // pass
    }

    // update header
    main.header.update(params);

    // set search format
    main.search.selectButton.setText(params.search.capitalize());
    main.search.selectButton.setIconClass(params.search + '-search-icon');

    // set results format
    main.results.selectButton.setText(params.results.capitalize());
    main.results.selectButton.setIconClass(params.results + '-results-icon');

    // assign save search button handler
    main.search.saveButton.setHandler(function () {
      // show save search dialog
      var dialog = new Martview.windows.SaveSearch();
      dialog.show();
      dialog.center();
      dialog.okButton.on('click', function () {
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
      dialog.okButton.on('click', function () {
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
          display_name: 'filter',
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
          display_name: 'column',
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
      var values = main.search.advanced.getForm().getValues();
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
    var form = main.search.simple;

    // show simple form
    main.search.showSimple();

    // update footer message
    main.footer.update({
      iconCls: 'info-icon',
      text: 'Enter search terms and then press the Enter key or the Submit button to fetch the results'
    });

    // reset event handler
    function resetSimpleSearch() {
      form.reset();
      main.results.clear();
    }

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(resetSimpleSearch);

    // submit search on enter key
    main.search.simple.items.first().on('specialkey', function (f, o) {
      if (o.getKey() == 13) {
        submitSearch();
      }
    });
  }

  /* -------------------------
     show guided search action
     ------------------------- */
  function showGuidedSearch(facets) {
    var form = main.search.guided;

    // show guided form
    main.search.showGuided(facets);

    // update footer message
    main.footer.update({
      iconCls: 'info-icon',
      text: 'Use the drop-down boxes to make the search more specific and narrow the results'
    });

    // reset event handler
    function resetGuidedSearch(submit) {
      form.reset();
      // default submit to true
      submit = typeof(submit) == 'undefined' ? true : submit;
      if (submit) submitSearch();
    }

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(resetGuidedSearch);

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
    var form = main.search.advanced;

    // show advanced search form
    main.search.showAdvanced(filters);

    // update footer message
    main.footer.update('info', 'Press the Submit button to fetch the results. Add filters to the search form to make the search more specific and narrow the results');

    // reset event handler
    function resetAdvancedSearch(submit) {
      form.reset();
      // default submit to true
      submit = typeof(submit) == 'undefined' ? true : submit;
      if (submit) submitSearch();
    }

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(resetAdvancedSearch);

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
    if (!main.search.isValid()) return;

    // build search params
    var search_params = new Object;
    if (params.search == 'simple') {
      var form = main.search.simple;
      var query = form.items.first().getValue().trim(); // FIXME: too verbose!
      if (!query) return; // abort submit if no search terms
      Ext.apply(search_params, {
        type: 'search',
        q: query
      });
    } else if (params.search == 'guided') {
      var form = main.search.guided;
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
        main.search.focus();

        // load data into results panel
        main.results.load(data, params.results);
      },
      failure: function () {
        main.search.focus();
      }
    });
  }
});
