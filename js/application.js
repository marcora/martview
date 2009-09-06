// FIXME: Abort conn on timeout
// FIXME: Do not reload search/results when user select same search/results as current
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
  var reset_filters_win_to_defaults = true;
  var reset_attributes_win_to_defaults = true;
  var default_filters, default_attributes;
  var search_formats = ['simple', 'guided', 'advanced', 'user'];
  var results_formats = ['tabular', 'itemized', 'map'];

  // init connection
  var conn = new Ext.data.Connection({
    autoAbort: true,
    listeners: {
      beforerequest: function () {
        loading.start();
      },
      requestcomplete: function () {
        loading.stop();
      },
      requestexception: function () {
        loading.stop();
        Ext.Msg.show({
          title: Martview.APP_TITLE,
          msg: Martview.CONN_ERR_MSG,
          closable: false,
          width: 300
        });
      }
    }
  });

  // extract params from query string
  var params = Ext.urlDecode(window.location.search.substring(1));

  // if not specified the default search is 'simple' and the default results is 'tabular'
  Ext.applyIf(params, {
    search: 'simple',
    results: 'itemized'
  });

  // populate select dataset menu with data from static json file on server
  var select_dataset_menu_url = './json/select_dataset_menu.json';
  conn.request({
    url: select_dataset_menu_url,
    success: function (response) {
      var select_dataset_menu_data = Ext.util.JSON.decode(response.responseText);
      main.header.load(select_dataset_menu_data, selectSearch);

      params.mart_name = params.mart;
      params.dataset_name = params.dataset;
      params.search_format = params.search;
      params.results_format = params.results;

      // validate params by recursively matching the select dataset menu
      var dataset_counter = 0;
      var single_dataset;
      function validateParams(menu) {
        menu.items.each(function (menu_item) {
          if (menu_item.leaf) {
            dataset_counter++;
            single_dataset = menu_item;
            if (params.mart_name == menu_item.mart_name && params.dataset_name == menu_item.dataset_name && search_formats.has(params.search_format) && results_formats.has(params.results_format)) {
              params.mart_display_name = menu_item.mart_display_name || menu_item.mart_name;
              params.dataset_display_name = menu_item.dataset_display_name || menu_item.dataset_name;
            }
          } else {
            validateParams(menu_item.menu);
          }
        });
      }
      validateParams(main.header.homeButton.menu);

      // call select search if params are valid
      if (params.dataset_display_name) {
        selectSearch(params);
      } else if (dataset_counter == 1) {
        // if only one dataset and even if not specified in params, select it automagically
        selectSearch(single_dataset); // or window.location.search = 'mart=' + single_dataset.mart_name + '&dataset=' + single_dataset.dataset_name;
      } else {
        // wait for select dataset menu click event
      }
    }
  });

  // show filters/attributes window on customize button click
  main.search.customizeButton.on('click', function () {
    filters_win.show();
    if (reset_filters_win_to_defaults) filters_win.resetToDefaultFields();
    reset_filters_win_to_defaults = false;
  });

  main.results.customizeButton.on('click', function () {
    attributes_win.show();
    if (reset_attributes_win_to_defaults) attributes_win.resetToDefaultFields();
    reset_attributes_win_to_defaults = false;
  });

  // submit search on submit button click
  main.search.submitButton.on('click', function () {
    submitSearch();
  });

  // select search on search/results menu click
  main.search.selectButton.menu.on('itemclick', function (item) {
    params.search_format = item.getItemId();
    selectSearch(params);
  });

  main.results.selectButton.menu.on('itemclick', function (item) {
    params.results_format = item.getItemId();
    submitSearch();
  });

  // extract array of default attributes/filters from tree
  function extractDefaults(tree, default_fields, include_fields) {
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
        extractDefaults(node['children'], default_fields, include_fields);
      }
    });
  }

  // parse query string into include_fields object
  function parseIncludeFields(include_fields) {
    var parsed = new Object;
    Ext.each(include_fields.split('|'), function (include_field) {
      var name_value = include_field.split(':');
      parsed[name_value[0]] = name_value[1];
    });
    return parsed;
  }

  function selectSearch(menu_item) {
    // if called from menu
    if (menu_item) params = menu_item;

    // if not specified the default search format is 'simple' and the default results format is 'tabular'
    Ext.applyIf(params, {
      search_format: 'simple',
      results_format: 'itemized'
    });

    // update breadcrumbs
    main.header.updateBreadcrumbs(params);

    // set search/results format icon
    main.search.selectButton.setIconClass(params.search_format + '_search_icon');
    main.results.selectButton.setIconClass(params.results_format + '_results_icon');

    // reset default filters and attributes
    default_filters = [];
    default_attributes = [];

    // init filters and attributes windows
    var dataset_url = './json/' + params.mart_name + '.' + params.dataset_name + '.json';

    conn.request({
      url: dataset_url,
      success: function (response) {
        var dataset = Ext.util.JSON.decode(response.responseText);

        // TODO: this is a mock implementation of user-defined searches
        if (params.search_format == 'user') {
          var include_filters = parseIncludeFields('assembly_type:DIMERIC|resolution_less_than:2|resolution_more_than:0');
        }

        // filters
        if (params.filters) {
          var include_filters = parseIncludeFields(params.filters);
        }

        extractDefaults(dataset.filters, default_filters, include_filters);
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
        if (params.attributes) {
          var include_attributes = parseIncludeFields(params.attributes);
        }
        extractDefaults(dataset.attributes, default_attributes, include_attributes);
        attributes_win = new Martview.windows.Fields({
          id: 'attributes',
          title: 'Add columns to the results grid',
          display_name: 'Columns',
          field_iconCls: 'attribute_icon',
          children: dataset.attributes,
          default_fields: default_attributes
        });
        attributes_win.on('hide', function () {
          submitSearch();
        });
        updateSearch(true);
      }
    });
  }

  function updateSearch(submit) {
    // add fields to search form
    if (params.search_format == 'simple') {
      showSimpleSearch();
    } else if (params.search_format == 'guided') {
      showGuidedSearch();
    } else if (params.search_format == 'advanced' || params.search_format == 'user') {
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
    }
  }

  function showSimpleSearch() {
    // update footer message
    main.footer.updateMessage('tip', 'Enter search terms and then press the Enter key or the Submit button to fetch the results');

    // hide customize results button
    main.results.customizeButton.hide();

    // clear results
    main.results.clear();

    // clear counter
    main.results.counterButton.setText('');

    // show simple form
    main.search.showSimpleForm();

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(function () {
      main.results.clear();
      form.getForm().reset();
      form.focus();
    });

    // submit search on enter key
    form.items.first().on('specialkey', function (f, o) {
      if (o.getKey() == 13) {
        submitSearch();
      }
    });
  }

  function showGuidedSearch(facets) {
    // update footer message
    main.footer.updateMessage('tip', 'Use the drop-down boxes to make the search more specific and narrow the results');

    // hide customize results button
    main.results.customizeButton.hide();

    // show guided form
    main.search.showGuidedForm(facets);

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

  function showAdvancedSearch(filters) {
    // update footer message
    main.footer.updateMessage('tip', 'Press the Submit button to fetch the results. Add filters to the search form to make the search more specific and narrow the results');

    // show customize results button
    main.results.customizeButton.show();

    // show advanced search form
    main.search.showAdvancedForm(filters);

    // reassign reset button handler
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(function () {
      form.getForm().reset();
      form.focus();
      submitSearch();
    });

    // submit key on enter key
    form.filters.items.each(function (item) {
      item.on('specialkey', function (f, o) {
        if (o.getKey() == 13) {
          submitSearch();
        }
      });
    });
  }

  function resetGuidedSearch() {
    form.filters.items.each(function (item) {
      if (item.xtype == 'facetfield') {
        form.filters.add({
          xtype: 'unfacetfield',
          name: item.getName(),
          value: item.getValue()
        });
      }
    });
    submitSearch();
  }

  function submitSearch() {
    // set search/results format icon
    main.search.selectButton.setIconClass(params.search_format + '_search_icon');
    main.results.selectButton.setIconClass(params.results_format + '_results_icon');

    var search_params = new Object;
    // build search params
    if (params.search_format == 'simple') {
      var query = form.items.first().getRawValue().trim(); // FIXME: too verbose!
      if (!query) return; // abort submit if no search terms
      Ext.apply(search_params, {
        type: 'search',
        q: query
      });
    } else if (params.search_format == 'guided') {
      var filters = [];
      form.filters.items.each(function (item) {
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
      form.filters.items.each(function (item) {
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
      Ext.apply(search_params, {
        type: 'search',
        q: '*:*',
        facet_fields: 'experiment_type|resolution|space_group|r_work',
        filters: filters.join('|')
      });
    } else if (params.search_format == 'advanced' || params.search_format == 'user') {
      var xml = buildQueryXml();
      Ext.apply(search_params, {
        type: 'query',
        xml: xml
      });
    }

    // log search params
    try {
      console.dir(params);
    } catch(e) {
      Ext.iterate(params, function (key, val) {
        log.info(key + ': ' + Ext.util.Format.htmlEncode(val));
      });
    }

    // submit query
    conn.request({
      url: '/martservice',
      params: search_params,
      success: function (response) {
        var data = Ext.util.JSON.decode(response.responseText);
        try {
          console.dir(data);
        } catch(e) {
          // pass
        }

        // build guided search form
        if (params.search_format == 'guided') {
          showGuidedSearch(data.facets);
        }
        form.focus();

        // load data into results panel
        main.results.enableHeaderButtons();
        main.results.load(data, params.results_format);
      },
      failure: function () {
        form.focus();
      }
    });
  }

  function buildQueryXml(values) {
    var dataset_filters = [];
    form.filters.items.each(function (item) {
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
