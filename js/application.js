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

            // init filters and attributes windows
            filters = new Martview.Fields({
              id: 'filters',
              title: 'Customize search',
              dataset_name: current_dataset
            });
            filters.on('hide', updateSearch);

            attributes = new Martview.Fields({
              id: 'attributes',
              title: 'Customize results',
              dataset_name: current_dataset
            });
            attributes.on('hide', updateSearch);

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
  main.search.submitButton.on('click', updateSearch);
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
    main.footer.updateTip('Fill and submit the search form to get the results. To modify the search form press the Customize button.');

    // bogus search form
    var chromosome_list = new Ext.data.SimpleStore({
      fields: ['id', 'chromosome'],
      data: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16'], ['17', '17'], ['18', '18'], ['19', '19'], ['20', '20'], ['21', '21'], ['22', '22'], ['X', 'X'], ['Y', 'Y']]
    });
    main.search.removeAll();
    if (params.search_name == 'simple') {
      main.search.add([{
        xtype: 'textfield',
        anchor: '100%',
        fieldLabel: 'Gene name or ID'
      }]);
    } else if (params.search_name == 'advanced') {
      main.search.add([{
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
        store: chromosome_list,
        displayField: 'chromosome'
      }]);
    }
    main.doLayout();
    return false;
  }

  function updateSearch() {
    var url = 'http://martservice.biomart.org'; // FIXME
    var xml = buildQueryXml();

    var store = function () {
      var fields = [];
      attributes.get('selected').items.each(function (item) {
        fields.push({
          name: item.treenode.attributes.name
        });
      });
      return new Ext.data.JsonStore({
        autoDestroy: true,
        root: 'rows',
        fields: fields
      });
    } ();

    var colModel = function () {
      var columns = [];
      attributes.get('selected').items.each(function (item) {
        columns.push({
          header: item.treenode.attributes.display_name || item.treenode.attributes.name,
          width: 100,
          sortable: true
        });
      });
      return new Ext.grid.ColumnModel(columns);
    } ();

    main.results.enableHeaderButtons();
    main.footer.updateTip('To modify the way the results are displayed press the Customize button or look under the Results menu.');

    Ext.ux.JSONP.request(url, {
      callbackKey: 'callback',
      params: {
        type: 'query',
        xml: xml
      },
      callback: function (data) {
        if (data) {
          store.loadData(data);
          main.results.load(store, colModel);
          main.results.updateCounter('1-' + store.getTotalCount() + ' of 34,560');
        }
        else {
          Ext.Msg.alert(Martview.APP_TITLE, 'Unable to connect to the BioMart service.');
        }
      }
    });
  }

  function buildQueryXml(values) {
    var dataset_filters = [];
    //     attributes.get('selected').items.each(function (item) {
    //       dataset_filters.push({
    //         name: item.name,
    //         value: null //item.value
    //       });
    //     });
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
