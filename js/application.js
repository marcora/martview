Ext.namespace('Martview');

Martview.Application = function (params) {

  // private attributes
  var conn = new Ext.data.Connection();
  var main = new Martview.Main();
  var header = main.getComponent('header');
  var search = main.getComponent('search');
  var results = main.getComponent('results');
  var footer = main.getComponent('footer');
  var selectinterface = Ext.getCmp('selectinterface');
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
  var current_interface;

  // populate the 'Select form' menu button
  var init = function () {

    var url = './json/marts_and_datasets.json';

    conn.request({
      url: url,
      success: function (response) {

        if (params['mart']) {
          // mart param
          current_mart = params['mart'];
          if (params['dataset']) {
            // mart + dataset params
            current_dataset = params['dataset'];
            if (params['interface']) {
              // mart + dataset + interface params
              current_interface = params['interface'];
              // set selectinterface menu
            }
          }
        } else {
          // no params
        }

        // populate select interace menu
        var menu_item = new Object;
        var data = Ext.util.JSON.decode(response.responseText);
        selectinterface.menu.add(data);
        // add selectInterface handler to each dataset menu item
        selectinterface.menu.items.each(function (mart) {
          mart.menu.items.each(function (dataset) {
            dataset.menu.on('itemclick', selectInterface);
            dataset.menu.items.each(function (jnterface) {
              if (current_mart == jnterface.mart_name) {
                menu_item.mart_name = jnterface.mart_name;
                menu_item.mart_display_name = jnterface.mart_display_name;
                if (current_dataset == jnterface.dataset_name) {
                  menu_item.dataset_name = jnterface.dataset_name;
                  menu_item.dataset_display_name = jnterface.dataset_display_name;
                  if (current_interface == jnterface.interface_name) {
                    menu_item.interface_name = jnterface.interface_name;
                    menu_item.interface_display_name = jnterface.interface_display_name;
                  }
                }
              }
            });
          });
        });
        if (menu_item.interface_name) selectInterface(menu_item);
      },
      failure: function () {
        Ext.Msg.alert(Martview.APP_TITLE, 'Unable to connect to the BioMart service.');
      }
    });
  } ();

  // event handlers
  var selectInterface = function (menu_item) {
    if (!(current_mart == menu_item.mart_name && current_dataset == menu_item.dataset_name && current_interface == menu_item.interface_name)) {
      window.location.search = 'mart=' + menu_item.mart_name + '&dataset=' + menu_item.dataset_name + '&interface=' + menu_item.interface_name;
      return;
    }
    // setup breadcrumbs
    header.get('home_sep').show();
    header.get('mart').setText(menu_item.mart_display_name || menu_item.mart_name).show();
    header.get('mart_sep').show();
    header.get('dataset').setText(menu_item.dataset_display_name || menu_item.dataset_name).show();
    header.get('dataset_sep').show();
    header.get('interface').setText(menu_item.interface_display_name || menu_item.interface_name).show();

    var search_tbar = search.getTopToolbar();
    search_tbar.items.get('customize').on('click', function () {
      filters.show();
    });
    search_tbar.items.each(function (item) {
      item.enable();
    });

    var search_bbar = search.getBottomToolbar();
    search_bbar.items.each(function (item) {
      item.enable();
    });

    footer.get('tip').setText('Fill and submit the form to see the results');

    var chromosome_list = new Ext.data.SimpleStore({
      fields: ['id', 'chromosome'],
      data: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['X', 'X'], ['Y', 'Y']]
    });
    search.removeAll();
    search.add([{
      xtype: 'textfield',
      fieldLabel: 'ENSEMBL Gene ID',
      anchor: '100%'
      //       xtype: 'fieldpanel',
      //       anchor: '100%',
      //       border: false,
      //       layout: 'anchor',
      //       fieldLabel: 'Ensembl Gene IDs',
      //       items: [{
      //         xtype: 'textarea',
      //         anchor: '100%'
      //       },
      //       {
      //         xtype: 'fileuploadfield',
      //         buttonText: '',
      //         anchor: '100%',
      //         buttonCfg: {
      //           iconCls: 'file_upload_icon'
      //         }
      //       }]
    },
    {
      xtype: 'combo',
      anchor: '100%',
      editable: false,
      forceSelection: true,
      lastSearchTerm: false,
      triggerAction: 'all',
      fieldLabel: 'Chromosome',
      mode: 'local',
      store: chromosome_list,
      displayField: 'chromosome'
    }]);
    // find a way to replace instead of adding
    main.doLayout();
    //.setText(menu_item.parentMenu.getText() + ' &sdot; ' + menu_item.getText());
  };

  // event listeners
  var search_bbar = search.getBottomToolbar();
  search_bbar.items.get('submit').on('click', function () {

    var results_tbar = results.getTopToolbar();
    results_tbar.items.get('customize').on('click', function () {
      attributes.show();
    });
    results_tbar.items.each(function (item) {
      item.enable();
    });

    var results_data = [['NeuroD', 71.72, 0.02, 0.03, '9/1 12:00am'], ['Huntingtin', 29.01, 0.42, 1.47, '9/1 12:00am'], ['HAP1', 83.81, 0.28, 0.34, '9/1 12:00am'], ['CaMKII', 52.55, 0.01, 0.02, '9/1 12:00am'], ['PSD-95', 64.13, 0.31, 0.49, '9/1 12:00am'], ['NF-kappa B', 31.61, -0.48, -1.54, '9/1 12:00am'], ['p65', 75.43, 0.53, 0.71, '9/1 12:00am'], ['p50', 67.27, 0.92, 1.39, '9/1 12:00am'], ['NR1', 49.37, 0.02, 0.04, '9/1 12:00am'], ['NR2A', 40.48, 0.51, 1.28, '9/1 12:00am'], ['NR2B', 68.1, -0.43, -0.64, '9/1 12:00am'], ['synGAP', 34.14, -0.08, -0.23, '9/1 12:00am'], ['RasGRF1', 30.27, 1.09, 3.74, '9/1 12:00am'], ['MyoD', 36.53, -0.03, -0.08, '9/1 12:00am'], ['Myogenin', 38.77, 0.05, 0.13, '9/1 12:00am'], ['Myf5', 19.88, 0.31, 1.58, '9/1 12:00am'], ['Neurogenin', 81.41, 0.44, 0.54, '9/1 12:00am'], ['Shank', 64.72, 0.06, 0.09, '9/1 12:00am'], ['Homer', 45.73, 0.07, 0.15, '9/1 12:00am'], ['Stargazin', 36.76, 0.86, 2.40, '9/1 12:00am'], ['Ras', 40.96, 0.41, 1.01, '9/1 12:00am'], ['I-kappa B', 25.84, 0.14, 0.54, '9/1 12:00am'], ['IKK', 27.96, 0.4, 1.45, '9/1 12:00am'], ['Dynein', 45.07, 0.26, 0.58, '9/1 12:00am'], ['MAP2', 61.91, 0.01, 0.02, '9/1 12:00am'], ['Erk1', 61.91, 0.01, 0.02, '9/1 12:00am'], ['Erk2', 61.91, 0.01, 0.02, '9/1 12:00am'], ['GFAP', 61.91, 0.01, 0.02, '9/1 12:00am'], ['N-CAM', 61.91, 0.01, 0.02, '9/1 12:00am'], ['Tubulin', 61.91, 0.01, 0.02, '9/1 12:00am'], ['Dynactin', 34.64, 0.35, 1.02, '9/1 12:00am'], ['Tubulin', 61.91, 0.01, 0.02, '9/1 12:00am'], ['Actin', 63.26, 0.55, 0.88, '9/1 12:00am']];

    // create the data store
    var results_store = new Ext.data.ArrayStore({
      fields: [{
        name: 'name'
      },
      {
        name: 'len',
        type: 'float'
      },
      {
        name: 'start',
        type: 'float'
      },
      {
        name: 'stop',
        type: 'float'
      },
      {
        name: 'updated',
        type: 'date',
        dateFormat: 'n/j h:ia'
      }]
    });
    results_store.loadData(results_data);

    // create the Grid
    var results_grid = new Ext.grid.GridPanel({
      store: results_store,
      enableColumnHide: false,
      enableHdMenu: false,
      disableSelection: true,
      columns: [{
        id: 'name',
        header: "Gene",
        width: 160,
        sortable: true,
        dataIndex: 'name'
      },
      {
        header: "Length",
        width: 75,
        sortable: true,
        dataIndex: 'len'
      },
      {
        header: "Start",
        width: 75,
        sortable: true,
        dataIndex: 'start'
      },
      {
        header: "Stop",
        width: 75,
        sortable: true,
        dataIndex: 'stop'
      },
      {
        header: "Last Updated",
        width: 85,
        sortable: true,
        renderer: Ext.util.Format.dateRenderer('m/d/Y'),
        dataIndex: 'updated'
      }],
      stripeRows: true,
      autoExpandColumn: 'name',
      border: false
    });

    results.items.clear();
    results.add(results_grid);
    results_store.loadData(results_data);
    results.getBottomToolbar().items.first().setText('1 - 50 of 43,678');
    // results.getBottomToolbar().items.first().setIconClass('count_icon');
    results.doLayout();
  });

};

Ext.BLANK_IMAGE_URL = './ext/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.onReady(function () {
  Ext.QuickTips.init();
  // extract params from query string
  var params = Ext.urlDecode(window.location.search.substring(1));
  // create and init app object
  new Martview.Application(params);
});
