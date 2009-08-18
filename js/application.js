// FIXME: When selecting current search menu gets stuck!
// TODO: Column order for query results should follow attribute order
// FIXME: When adding lots of filters to search form, an ugly horizontal scroll bar appears because fields do not resize when vertical scroll bar appears
Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.namespace('Martview');

Ext.onReady(function () {
  Ext.QuickTips.init();

  // init viewport and windows
  var main = new Martview.Main();
  var filters, attributes;

  // init params
  var current_mart, current_dataset, current_search;

  // init connection
  var conn = new Ext.data.Connection();

  // extract params from query string
  var params = Ext.urlDecode(window.location.search.substring(1));

  // populate select search menu with data from static json file on server
  var select_search_menu_url = './json/marts_and_datasets.json';
  conn.request({
    url: select_search_menu_url,
    success: function (response) {
      var select_search_menu_data = Ext.util.JSON.decode(response.responseText);
      main.search.selectButton.menu.add(select_search_menu_data);
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
    }

    main.search.enableHeaderButtons();
    main.search.enableFormButtons();
    main.header.updateBreadcrumbs(params);

    // init filters and attributes windows
    filters = new Martview.Fields({
      id: 'filters',
      title: 'Add fields to the search form',
      display_name: 'Fields',
      dataset_name: current_dataset
    });
    filters.on('hide', updateSearch);

    attributes = new Martview.Fields({
      id: 'attributes',
      title: 'Add columns to the results grid',
      display_name: 'Columns',
      dataset_name: current_dataset
    });
    attributes.on('hide', submitSearch);

    updateSearch();
  }

  function updateSearch() {
    var form = main.search.items.first(); // FIXME: why not main.search.form?!?
    // add fields to search form
    if (current_search == 'simple') {
      showSimple(form);
    } else if (current_search == 'faceted') {
      showFaceted(form);
    } else if (current_search == 'advanced') {
      showAdvanced(form);
    } else if (current_search == 'user') {
      showUserDefined(form);
    }
    try {
      form.items.first().focus('', 50);
    } catch(e) {
      // do nothing
    }
    form.doLayout();
  }

  function showSimple(form) {
    // update gui
    main.footer.updateTip('Enter search terms and then press the Enter key or the Submit button to fetch the results');

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
      title: '<img src="../ico/question.png" style="vertical-align: bottom !important;" /> <span style="font-weight: normal !important; color: #000 !important;">Help</span>',
      autoHeight: true,
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
  }

  function showFaceted(form) {
    // update gui
    main.footer.updateTip('[faceted search tip]');

    // remove all fields from search form
    form.removeAll();

    // add faceted search fields to form
    form.add([{}]);
  }

  function showAdvanced(form) {
    // update gui
    main.search.customizeButton.show();
    main.results.customizeButton.show();
    main.footer.updateTip('Fill the search form and then press the Submit button to fetch the results');

    // remove all fields from search form
    form.removeAll();

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
  }

  function showUserDefined(form) {
    // update gui
    main.footer.updateTip('[user defined search tip]');

    // remove all fields from search form
    form.removeAll();

    // add user-defined search fields to form
    form.add([{}]);
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

    // log search params
    try {
      console.dir(params);
    } catch(e) {
      Ext.iterate(params, function (key, val) {
        log.info(key + ': ' + Ext.util.Format.htmlEncode(val));
      });
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
