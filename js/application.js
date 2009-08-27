// FIXME: Loading dialog gets stuck if error
// TODO: Column order for query results should follow attribute order
// FIXME: When adding lots of filters to search form, an ugly horizontal scroll bar appears because fields do not resize when vertical scroll bar appears
Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.namespace('Martview');

Ext.onReady(function () {

  Ext.QuickTips.init();

  // init viewport, windows and vars
  var main = new Martview.Main();
  var form = main.search.items.first(); // FIXME: why not main.search.form?!?
  var loading = new Martview.windows.Loading();
  var current_mart, current_dataset, current_search, current_results;
  var filters, attributes;
  var default_filters = [];
  var default_attributes = [];

  // init connection
  var conn = new Ext.data.Connection();

  // extract params from query string
  var params = Ext.urlDecode(window.location.search.substring(1));
  // if not specified the default search is 'simple' and the default results is 'tabular'
  Ext.applyIf(params, {
    search: 'simple',
    results: 'tabular'
  });

  // populate select search menu with data from static json file on server
  var select_dataset_menu_url = './json/marts_and_datasets.json';
  loading.start();
  conn.request({
    url: select_dataset_menu_url,
    success: function (response) {
      var select_dataset_menu_data = Ext.util.JSON.decode(response.responseText);
      main.header.selectButton.menu.add(select_dataset_menu_data);
      // add handler to each select search menu item
      main.header.selectButton.menu.items.each(function (mart_item) {
        mart_item.menu.on('itemclick', selectSearch);
      });
      // call select search if params are valid
      if (params.mart) {
        // mart param
        current_mart = params.mart_name = params.mart;
        if (params.dataset) {
          // mart + dataset params
          current_dataset = params.dataset_name = params.dataset;
          current_search = params.search;
          current_results = params.results;
          main.header.selectButton.menu.items.each(function (item) {
            item.menu.items.each(function (item) {
              if (params.mart_name == item.mart_name && params.dataset_name == item.dataset_name) {
                params.mart_display_name = item.mart_display_name || item.mart_name;
                params.dataset_display_name = item.dataset_display_name || item.dataset_name;
              }
            });
          });
          // call select search
          if (params.dataset_display_name) selectSearch(params);
        }
      }
      loading.stop();
    },
    failure: function () {
      loading.stop();
      Ext.Msg.show({
        title: Martview.APP_TITLE,
        msg: Martview.CONN_ERR_MSG,
        closable: false,
        width: 300
      });
    }
  });

  // bindings
  main.search.customizeButton.on('click', function () {
    filters.show();
  });

  main.results.customizeButton.on('click', function () {
    attributes.show();
  });

  main.search.submitButton.on('click', function () {
    submitSearch();
  });

  main.search.selectButton.menu.on('itemclick', function (item) {
    selectSearch({
      mart_name: current_mart,
      dataset_name: current_dataset,
      search: item.getItemId(),
      results: current_results
    });
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
      search: 'simple',
      results: 'tabular'
    });

    if (! (current_mart == params.mart_name && current_dataset == params.dataset_name && current_search == params.search && current_results == params.results)) {
      window.location.search = 'mart=' + params.mart_name + '&dataset=' + params.dataset_name + '&search=' + params.search + '&results=' + params.results;
    }

    main.search.enableHeaderButtons();
    main.search.enableFormButtons();
    main.header.updateBreadcrumbs(params);

    // init filters and attributes windows
    var dataset_url = './json/' + current_mart + '.' + current_dataset + '.json';
    loading.start();
    conn.request({
      url: dataset_url,
      success: function (response) {
        var dataset = Ext.util.JSON.decode(response.responseText);

        // filters
        extractDefaults(dataset.filters, default_filters);
        filters = new Martview.windows.Fields({
          id: 'filters',
          title: 'Add filters to the search form',
          display_name: 'Filters',
          field_iconCls: 'filter_icon',
          children: dataset.filters
        });
        filters.on('hide', function () {
          updateSearch(false);
        });

        // attributes
        extractDefaults(dataset.attributes, default_attributes);
        attributes = new Martview.windows.Fields({
          id: 'attributes',
          title: 'Add columns to the results grid',
          display_name: 'Attributes',
          field_iconCls: 'attributes_icon',
          children: dataset.attributes
        });
        attributes.on('hide', function () {
          submitSearch();
        });
        updateSearch(true);
        loading.stop();
      },
      failure: function () {
        loading.stop();
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
      showAdvancedSearch(submit);
    } else if (current_search == 'user') {
      showUserSearch(submit);
    }
    try {
      form.items.first().focus('', 50);
    } catch(e) {
      // do nothing
    }
  }

  function showSimpleSearch() {
    // update gui
    main.footer.updateMessage('tip', 'Enter search terms and then press the Enter key or the Submit button to fetch the results');

    // remove all fields from search form
    form.removeAll();

    // add simple search fields to form
    form.add([{
      xtype: 'textfield',
      anchor: '100%',
      fieldLabel: 'Enter search terms',
      listeners: {
        specialkey: function (f, o) {
          if (o.getKey() == 13) {
            submitSearch();
          }
        }
      }
    },
    {
      // Lucene query syntax help
      xtype: 'fieldset',
      title: '<img src="./ico/question.png" style="vertical-align: text-bottom !important;" /> <span style="font-weight: normal !important; color: #000 !important;">Help</span>',
      autoHeight: true,
      //       collapsed: true,
      //       collapsible: true,
      defaultType: 'displayfield',
      defaults: {
        labelStyle: 'font-weight: bold;'
      },
      items: [{
        hideLabel: true,
        value: 'For more advanced searches, you can enter search terms using the <a href="http://lucene.apache.org/java/2_4_1/queryparsersyntax.html" target="_blank">Lucene query syntax</a> and the following fields:'
      },
      {
        fieldLabel: 'pdb_id',
        value: 'search by PDB ID (for example, <code>pdb_id:11ba</code>)'
      },
      {
        fieldLabel: 'experiment_type',
        value: 'search by experiment type (for example, <code>experiment_type:NMR</code>)'
      },
      {
        fieldLabel: 'resolution',
        value: 'search by resolution (for example, <code>resolution:[3 TO *]</code>)'
      },
      {
        fieldLabel: 'authors',
        value: 'search by author name (for example, <code>authors:Mishima</code>)'
      }]
    }]);
    form.doLayout();
  }

  function showGuidedSearch(facets) {
    // update gui
    main.footer.updateMessage('tip', 'Use the drop-down boxes to make the search more specific and narrow the results');

    // disable submit button and reassign reset button handlers
    main.search.submitButton.disable();
    main.search.resetButton.purgeListeners();
    main.search.resetButton.setHandler(function () {
      window.location.href = window.location.href;
    });

    // remove all fields from search form
    // FIXME: this is way to intricate and indeed it's a bug that should be fixed in Ext v3.1
    form.items.clear();
    form.getForm().items.each(function (field) {
      field.destroy();
    });

    // add guided search fields to form
    if (facets) {
      form.add(facets);
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
      form.doLayout();
    } else {
      form.doLayout();
      submitSearch();
    }
  }

  function showAdvancedSearch(submit) {
    // update gui
    main.search.customizeButton.show();
    main.results.customizeButton.show();
    main.footer.updateMessage('tip', 'Press the Submit button to fetch the results. Add filters to the search form to make the search more specific and narrow the results');

    // remove all fields from search form
    form.removeAll();

    //     // add help if no filters are selected
    //     if (filters.get('selected').items.getCount() == 0) {
    //       form.add([{
    //         // Lucene query syntax help
    //         xtype: 'fieldset',
    //         title: '<img src="../ico/question.png" style="vertical-align: text-bottom !important;" /> <span style="font-weight: normal !important; color: #000 !important;">Help</span>',
    //         autoHeight: true,
    //         defaultType: 'displayfield',
    //         defaults: {
    //           labelStyle: 'font-weight: bold;'
    //         },
    //         items: [{
    //           hideLabel: true,
    //           value: 'Add fields to the form if you want to narrow down the search'
    //         }]
    //       }]);
    //     }
    // add advanced search fields (filters) to form
    filters.get('selected').items.each(function (item) {
      if (item.treenode.attributes.qualifier in {
        '=': '',
        '>': '',
        '<': ''
      }) {
        if (item.treenode.attributes.options) {
          form.add([{
            xtype: 'combo',
            anchor: '100%',
            name: item.treenode.attributes.name,
            fieldLabel: item.treenode.attributes.display_name || item.treenode.attributes.name,
            editable: false,
            forceSelection: true,
            lastSearchTerm: false,
            triggerAction: 'all',
            mode: 'local',
            store: item.treenode.attributes.options.split(',')
          }]);
        } else {
          form.add([{
            xtype: 'textfield',
            anchor: '100%',
            name: item.treenode.attributes.name,
            fieldLabel: item.treenode.attributes.display_name || item.treenode.attributes.name
          }]);
        }
      } else if (item.treenode.attributes.qualifier in {
        'in': ''
      }) {
        form.add({
          xtype: 'textfield',
          anchor: '100%',
          name: item.treenode.attributes.name,
          fieldLabel: item.treenode.attributes.display_name || item.treenode.attributes.name
        });
      }
    });
    form.doLayout();
    if (submit) {
      submitSearch();
    }
  }

  function showUserSearch(submit) {
    // update gui
    main.search.customizeButton.show();
    main.results.customizeButton.show();
    main.footer.updateMessage('tip', 'Press the Submit button to fetch the results.');

    // remove all fields from search form
    form.removeAll();

    // TODO: Add user-defined search fields to form
    // bogus search form
    form.add([{
      xtype: 'textfield',
      anchor: '100%',
      fieldLabel: '% GC',
      value: 80
    },
    {
      xtype: 'combo',
      anchor: '100%',
      fieldLabel: 'Chromosome',
      value: 5,
      editable: false,
      forceSelection: true,
      lastSearchTerm: false,
      triggerAction: 'all',
      mode: 'local',
      store: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'], ['18', '18'], ['19', '19'], ['20', '20'], ['21', '21'], ['22', '22'], ['X', 'X'], ['Y', 'Y']]
    }]);
    form.doLayout();
    if (submit) {
      submitSearch();
    }
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
          console.info(item.xtype + ' < facet or hidden ' + filter.name);
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
          console.info(item.xtype + ' < unfacet ' + filter.name);
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
    loading.start();
    conn.request({
      url: '/martservice',
      params: params,
      success: function (response) {
        var data = Ext.util.JSON.decode(response.responseText);
        try {
          console.dir(data);
        } catch(e) {
          // foo
        }
        main.results.enableHeaderButtons();
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
        loading.stop();
      },
      failure: function () {
        loading.stop();
        Ext.Msg.show({
          title: Martview.APP_TITLE,
          msg: Martview.CONN_ERR_MSG,
          closable: false,
          width: 300
        });
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
    attributes.get('selected').items.each(function (item) {
      dataset_attributes.push({
        name: item.treenode.attributes.name
      });
    });
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
