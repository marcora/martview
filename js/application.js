// FIXME: When selecting current search menu gets stuck!
// TODO: Column order for query results should follow attribute order
Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.namespace('Martview');

Ext.onReady(function () {
  Ext.QuickTips.init();

  // init viewport and windows
  var main = new Martview.Main();
  var filters;
  var attributes;

  var current_mart;
  var current_dataset;
  var current_search;

  // extract params from query string
  var params = Ext.urlDecode(window.location.search.substring(1));

  // populate select search menu with json file
  var select_menu_url = './json/marts_and_datasets.json';
  var conn = new Ext.data.Connection();
  conn.request({
    url: select_menu_url,
    success: function (response) {
      var select_menu_data = Ext.util.JSON.decode(response.responseText);
      main.search.selectButton.menu.add(select_menu_data);
      // add handler to each select search menu item
      main.search.selectButton.menu.items.each(function (mart_item) {
        mart_item.menu.items.each(function (dataset_item) {
          dataset_item.menu.on('itemclick', selectSearch);
        });
      });
      // call select search if params are valid
      if (params.mart) {
        // mart param
        current_mart = params.mart_name = params.mart;
        if (params.dataset) {
          // mart + dataset params
          current_dataset = params.dataset_name = params.dataset;
          if (params.search) {
            // mart + dataset + search params
            current_search = params.search_name = params.search;
            main.search.selectButton.menu.items.each(function (mart_item) {
              if (params.mart_name == mart_item.name) {
                params.mart_display_name = mart_item.display_name || mart_item.name;
              }
              mart_item.menu.items.each(function (dataset_item) {
                if (params.dataset_name == dataset_item.name) {
                  params.dataset_display_name = dataset_item.display_name || dataset_item.name;
                }
                dataset_item.menu.items.each(function (search_item) {
                  // FIXME: inconsisten name and display name properties of search item
                  if (params.search_name == search_item.search_name) {
                    params.search_display_name = search_item.search_display_name || search_item.search_name;
                  }
                });
              });
            });
            // call select search
            if (params.search_display_name) selectSearch(params);
          }
        }
      }
    },
    failure: function () {
      Ext.Msg.alert(Martview.APP_TITLE, 'Unable to connect to the BioMart service.');
    }
  });

  // bindings
  main.search.submitButton.on('click', submitSearch);
  main.search.customizeButton.on('click', function () {
    filters.show();
  });
  main.results.customizeButton.on('click', function () {
    attributes.show();
  });

  // event handlers
  function selectSearch(params) {

    if (! (current_mart == params.mart_name && current_dataset == params.dataset_name && current_search == params.search_name)) {
      window.location.search = 'mart=' + params.mart_name + '&dataset=' + params.dataset_name + '&search=' + params.search_name;
      return false;
    }

    main.search.enableHeaderButtons();
    main.search.enableFormButtons();
    main.header.updateBreadcrumbs(params);

    // init filters and attributes windows
    filters = new Martview.Fields({
      id: 'filters',
      title: 'Customize search',
      dataset_name: current_dataset
    });
    filters.on('hide', submitSearch);

    attributes = new Martview.Fields({
      id: 'attributes',
      title: 'Customize results',
      dataset_name: current_dataset
    });

    // submit search when attributes windows is "closed"
    attributes.on('hide', submitSearch);

    // updatesearch when filters windows is "closed"
    filters.on('hide', showAdvanced);

    // remove all fields from search form
    main.search.items.first().removeAll(); // FIXME: why not main.search.form !!!
    // add fields to search form
    if (params.search_name == 'simple') {
      main.search.items.first().add([{ // FIXME: why not main.search.form !!!
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
      }]);
      main.footer.updateTip('Enter search terms using the Lucene syntax and press the Enter key or the Submit button to fetch the results');
    } else if (params.search_name == 'faceted') {
      // TODO: faceted search
    } else if (params.search_name == 'advanced') {
      showAdvanced();
    } else if (params.search_name == 'user') {
      showAdvanced();
    }
    try {
      main.search.items.first().items.first().focus('', 50);
    } catch(e) {
      // foo
    }
    main.doLayout();
    return false;
  }

  function showAdvanced() {
    // show customize buttons
    main.search.customizeButton.show();
    main.results.customizeButton.show();
    main.footer.updateTip('Add filters, fill the form and press the Submit button to fetch the results');
    // add filter fields to form
    var form = main.search.items.first(); // FIXME: why not main.search.form !!!
    form.removeAll();
    filters.get('selected').items.each(function (item) {
      console.dir(item.treenode.attributes);
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
    main.doLayout();
    return false;
  }

  function submitSearch() {
    var url = 'http://martservice.biomart.org:3000'; // FIXME: hard-coded!
    if (current_search == 'simple') {
      var params = {
        type: 'search',
        q: main.search.items.first().items.first().getRawValue() // FIXME: too verbose!
      };
    } else if (current_search == 'faceted') {
      // TODO: faceted search
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

    Ext.ux.JSONP.request(url, {
      callbackKey: 'callback',
      params: params,
      callback: function (data) {
        if (data) {
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
          if (data.count) {
            main.results.updateCounter(store.getTotalCount() + ' of ' + data.count);
          }
        }
        else {
          Ext.Msg.alert(Martview.APP_TITLE, 'Unable to connect to the BioMart service.');
        }
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
      uniqueRows: 0,
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
    console.log(xml);
    return xml;
  }
});
