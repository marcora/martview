// FIXME: Loading dialog gets stuck if error
// TODO: Column order for query results should follow attribute order
// FIXME: When adding lots of filters to search form, an ugly horizontal scroll bar appears because fields do not resize when vertical scroll bar appears
Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.namespace('Martview');

Ext.onReady(function () {

  Ext.QuickTips.init();

  // init viewport, windows and global vars
  var main = new Martview.Main();
  var form = main.search.form;
  var loading = new Martview.windows.Loading();
  var filters_win, attributes_win;
  var default_filters, default_attributes;
  var current_mart, current_dataset, current_search, current_results;

  // init connection
  var conn = new Ext.data.Connection({
    listeners: {
      beforerequest: function () {
        loading.start();
      },
      requestcomplete: function () {
        loading.stop();
      },
      requestexception: function () {
        loading.stop();
        Ext.Msg.alert(Martview.APP_TITLE, Martview.CONN_ERR_MSG);
      }
    }
  });

  // extract params from query string
  var params = Ext.urlDecode(window.location.search.substring(1));
  // if not specified the default search is 'simple' and the default results is 'tabular'
  Ext.applyIf(params, {
    search: 'simple',
    results: 'tabular'
  });

  // populate select search menu with data from static json file on server
  var select_dataset_menu_url = './json/marts_and_datasets.json';
  conn.request({
    url: select_dataset_menu_url,
    success: function (response) {
      var select_dataset_menu_data = Ext.util.JSON.decode(response.responseText);
      main.header.homeButton.menu.add(select_dataset_menu_data);
      // add handler to each select dataset menu item
      main.header.homeButton.menu.items.each(function (mart_item) {
        mart_item.menu.on('itemclick', selectSearch);
      });
      // call select search if params are valid
      if (params.mart) {
        // mart param
        current_mart = params.mart_name = params.mart;
        if (params.dataset) {
          // mart + dataset params
          current_dataset = params.dataset_name = params.dataset;
          current_search = params.search_name = params.search;
          current_results = params.results_name = params.results;
          main.header.homeButton.menu.items.each(function (mart_item) {
            mart_item.menu.items.each(function (dataset_item) {
              if (params.mart_name == dataset_item.mart_name && params.dataset_name == dataset_item.dataset_name) {
                params.mart_display_name = dataset_item.mart_display_name || dataset_item.mart_name;
                params.dataset_display_name = dataset_item.dataset_display_name || dataset_item.dataset_name;
              }
            });
          });
          // call select search
          if (params.dataset_display_name) {
            selectSearch(params);
          }
        }
      }
    }
  });

  // bindings
  main.search.customizeButton.on('click', function () {
    filters_win.show();
  });

  main.results.customizeButton.on('click', function () {
    attributes_win.show();
  });

  main.search.submitButton.on('click', function () {
    submitSearch();
  });

  main.search.selectButton.menu.on('itemclick', function (item) {
    params.search_name = item.getItemId();
    selectSearch(params);
  });

  main.results.selectButton.menu.on('itemclick', function (item) {
    params.results_name = item.getItemId();
    selectSearch(params);
  });

  // extract array of default attributes/filters from tree
  function extractDefaults(array, defaults) {
    Ext.each(array, function (node) {
      if (node['leaf']) {
        if (node['default']) {
          defaults.push(node);
        }
      } else {
        extractDefaults(node['children'], defaults);
      }
    });
  }

  // event handlers
  function selectSearch(params) {

    // if not specified the default search is 'simple' and the default results is 'tabular'
    Ext.applyIf(params, {
      search_name: 'simple',
      results_name: 'tabular'
    });

    if (! (current_mart == params.mart_name && current_dataset == params.dataset_name && current_search == params.search_name && current_results == params.results_name)) {
      window.location.search = 'mart=' + params.mart_name + '&dataset=' + params.dataset_name + '&search=' + params.search_name + '&results=' + params.results_name;
    }

    main.search.selectButton.setIconClass(params.search_name + '_search_icon');
    main.results.selectButton.setIconClass(params.results_name + '_results_icon');
    main.search.enableHeaderButtons();
    main.search.enableFormButtons();
    main.header.updateBreadcrumbs(params);

    // reset default filters and attributes
    default_filters = [];
    default_attributes = [];

    // init filters and attributes windows
    var dataset_url = './json/' + current_mart + '.' + current_dataset + '.json';

    conn.request({
      url: dataset_url,
      success: function (response) {
        var dataset = Ext.util.JSON.decode(response.responseText);

        // filters
        extractDefaults(dataset.filters, default_filters);
        filters_win = new Martview.windows.Fields({
          id: 'filters',
          title: 'Add filters to the search form',
          display_name: 'Filters',
          field_iconCls: 'filter_icon',
          children: dataset.filters,
          default_fields: default_filters
        });
        filters_win.on('hide', function () {
          updateSearch(false);
        });

        // attributes
        extractDefaults(dataset.attributes, default_attributes);
        attributes_win = new Martview.windows.Fields({
          id: 'attributes',
          title: 'Add columns to the results grid',
          display_name: 'Attributes',
          field_iconCls: 'attribute_icon',
          children: dataset.attributes,
          default_fields: default_attributes
        });
        attributes_win.on('hide', function () {
          submitSearch();
        });
        updateSearch(true);
      },
      failure: function () {
        Ext.Msg.show({
          title: Martview.APP_TITLE,
          msg: Martview.CONN_ERR_MSG,
          closable: false,
          width: 300
        });
      }
    });
  }

  function updateSearch(submit) {
    // add fields to search form
    if (current_search == 'simple') {
      showSimpleSearch();
    } else if (current_search == 'guided') {
      showGuidedSearch();
    } else if (current_search == 'advanced') {
      if (filters_win.rendered) {
        var filters = [];
        filters_win.selected.items.each(function (item) {
          filters.push(item.treenode.attributes);
        });
      } else {
        var filters = default_filters;
      }
      showAdvancedSearch(filters);
      if (submit) submitSearch();
    } else if (current_search == 'user') {
      var filters = []; // TODO: get filters from saved user search, with values!?!
      showAdvancedSearch(filters);
      if (submit) submitSearch();
    }
  }

  function showSimpleSearch() {
    // update message
    main.footer.updateMessage('tip', 'Enter search terms and then press the Enter key or the Submit button to fetch the results');

    // show simple form
    main.search.showSimpleForm();

    // add handlers to field
    form.items.first().on('specialkey', function (f, o) {
      if (o.getKey() == 13) {
        submitSearch();
      }
    });
  }

  function showGuidedSearch(facets) {
    // update message
    main.footer.updateMessage('tip', 'Use the drop-down boxes to make the search more specific and narrow the results');

    // show guided form
    main.search.showGuidedForm(facets);

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(function () {
      form.items.each(function (item) {
        if (item.xtype == 'facetfield') {
          form.add({
            xtype: 'unfacetfield',
            name: item.getName(),
            value: item.getValue()
          });
        }
      });
      submitSearch();
    });

    // add handlers to fields
    if (facets) {
      form.items.each(function (item) {
        if (item.xtype == 'combo') {
          item.on('select', function (item) {
            form.add({
              xtype: 'hidden',
              name: item.getName(),
              value: item.getValue()
            });
            submitSearch();
          });
        } else if (item.xtype == 'facetfield') {
          item.on('triggerclick', function (item) {
            form.add({
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

  function showAdvancedSearch(filters) {
    // update message
    main.footer.updateMessage('tip', 'Press the Submit button to fetch the results. Add filters to the search form to make the search more specific and narrow the results');

    // show advanced search form
    main.search.showAdvancedForm(filters);
  }

  function submitSearch() {
    // build search params
    if (current_search == 'simple') {
      var query = form.items.first().getRawValue().trim(); // FIXME: too verbose!
      if (!query) return; // abort submit if no search terms
      var params = {
        type: 'search',
        q: query // FIXME: too verbose!
      };
    } else if (current_search == 'guided') {
      var filters = [];
      form.items.each(function (item) {
        var filter = {
          name: item.getName(),
          value: item.getRawValue()
        };
        if (item.xtype in {
          'hidden': '',
          'facetfield': ''
        }) {
          filters.push(filter.name + ':' + filter.value);
        }
      });
      form.items.each(function (item) {
        var filter = {
          name: item.getName(),
          value: item.getRawValue()
        };
        if (item.xtype in {
          'unfacetfield': ''
        }) {
          filters.remove(filter.name + ':' + filter.value);
        }
      });
      var params = {
        type: 'search',
        q: '*:*',
        facet_fields: 'experiment_type|resolution|space_group',
        filters: filters.join('|')
      };
    } else if (current_search == 'advanced') {
      var xml = buildQueryXml();
      var params = {
        type: 'query',
        xml: xml
      };
    } else if (current_search == 'user') {
      var xml = buildQueryXml();
      var params = {
        type: 'query',
        xml: xml
      };
    }

    // log search params
    try {
      console.dir(params);
    } catch(e) {
      Ext.iterate(params, function (key, val) {
        log.info(key + ': ' + Ext.util.Format.htmlEncode(val));
      });
    }

    // submit
    conn.request({
      url: '/martservice',
      params: params,
      success: function (response) {
        main.results.enableHeaderButtons((current_search == 'advanced'));
        var data = Ext.util.JSON.decode(response.responseText);
        try {
          console.dir(data);
        } catch(e) {
          // foo
        }
        var store = new Ext.data.JsonStore({
          autoDestroy: true,
          root: 'rows',
          idProperty: name,
          fields: data.fields
        });
        store.loadData(data);
        var colModel = new Ext.grid.ColumnModel(data.columns);
        main.results.load(store, colModel);
        main.results.updateCounter(store.getTotalCount() + ' of ' + data.count);
        // build guided search form
        if (current_search == 'guided') {
          showGuidedSearch(data.facets);
        }
        form.focus();
      },
      failure: function () {
        Ext.Msg.show({
          title: Martview.APP_TITLE,
          msg: Martview.CONN_ERR_MSG,
          closable: false,
          width: 300
        });
        form.focus();
      }
    });
  }

  function buildQueryXml(values) {
    var dataset_filters = [];
    main.search.items.first().items.each(function (item) {
      if (item.getRawValue().trim()) {
        dataset_filters.push({
          name: item.getName(),
          value: item.getRawValue().trim()
        });
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
      datasetName: current_dataset,
      datasetFilters: dataset_filters,
      datasetAttributes: dataset_attributes
    });
    // TODO: raise if datasetName is null!
    var tpl = new Ext.XTemplate('<?xml version="1.0" encoding="UTF-8"?>', //
    '<!DOCTYPE Query>', //
    '<Query virtualSchemaName="{virtualSchemaName}" formatter="{formatter}" header="{header}" uniqueRows="{uniqueRows}" count="{count}" limitSize="{limitSize}" datasetConfigVersion="{datasetConfigVersion}">', //
    '<Dataset name="{datasetName}" interface="{datasetInterface}">', //
    '<tpl for="datasetFilters">', //
    '<Filter name="{name}" value="{value}"/>', //
    '</tpl>', //
    '<tpl for="datasetAttributes">', //
    '<Attribute name="{name}"/>', //
    '</tpl>', //
    '</Dataset>', //
    '</Query>');
    var xml = tpl.apply(values);
    return xml;
  }
});
