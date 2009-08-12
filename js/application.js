Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.namespace('Martview');

Ext.onReady(function () {
  Ext.QuickTips.init();

  // init viewport and filters/attributes windows
  var main = new Martview.Main();
  var filters = new Martview.Fields({
    id: 'filters',
    title: 'Customize search'
  });
  var attributes = new Martview.Fields({
    id: 'attributes',
    title: 'Customize results'
  });

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

  function submitSearch() {
    main.results.enableHeaderButtons();
    main.results.updateCounter('1-100 of 34,560');
    main.results.load();
    main.footer.updateTip('To modify the way the results are displayed press the Customize button or look under the Results menu.');
  }

});
