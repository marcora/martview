Ext.namespace('Martview');

Martview.Application = function (params) {

  // private attributes
  var conn = new Ext.data.Connection();
  var viewport = new Martview.Viewport();
  var header = viewport.getComponent('header');
  var query = viewport.getComponent('query');
  var results = viewport.getComponent('results');
  var footer = viewport.getComponent('footer');
  var selectform = Ext.getCmp('selectform');
  var selectview = Ext.getCmp('selectview');
  var attributes = new Martview.Attributes();

  var current_server;
  var current_query;
  var current_form;
  if (params.server) {
    current_server = params.server;
    if (params.query) {
      current_query = params.query;
      if (params.form) {
        current_form = params.form;
      }
    }
  }

  // populate the 'Choose database' menu button, should go into database init
  var init = function () {
    var url;
    if (current_server) {
      url = './json/' + params.server + '.datasets.json';
    } else {
      url = './json/marts_and_datasets.json';
    }
    conn.request({
      url: url,
      success: function (response) {
        var data = Ext.util.JSON.decode(response.responseText);
        if (current_server) {
          if (current_query) {
            // server + query params
            Ext.each(data, function (dataset) {
              if (dataset.name == current_query) {
                data = dataset.menu;
                selectform.menu.add(data);
                // add selectForm handler to each dataset menu item
                selectform.menu.on('itemclick', selectForm);
              }
            });
            if (current_form) {
              // server + query + form params
              Ext.each(data, function (form) {
                if (form.text.toLowerCase() == current_form) {
                  // TODO: supply selectform with correct object
                  selectForm({
                    mart_display_name: current_server,
                    dataset_display_name: current_query,
                    mart_name: current_server,
                    dataset_name: current_query
                  });
                }
              });
            }
          } else {
            // server param only
            selectform.menu.add(data);
            // add selectForm handler to each dataset menu item
            selectform.menu.items.each(function (dataset) {
              dataset.menu.on('itemclick', selectForm);
            });
          }
        } else {
          // no params
          selectform.menu.add(data);
          // add selectForm handler to each dataset menu item
          selectform.menu.items.each(function (mart) {
            mart.menu.items.each(function (dataset) {
              dataset.menu.on('itemclick', selectForm);
            });
          });
        }
      },
      failure: function () {
        Ext.Msg.alert(Martview.APP_TITLE, 'Unable to connect to the BioMart service.');
      }
    });
  } ();

  // event handlers
  var selectForm = function (menu_item) {
    var query_tbar = query.getTopToolbar();
    query_tbar.items.each(function (item) {
      item.enable();
    });
    selectform.setText('Change form');
    footer.findById('tip').setText('Fill and submit the form to see the results');
    var query_bbar = query.getBottomToolbar();
    query_bbar.removeAll();
    query_bbar.addItem({
      cls: 'x-btn-icon',
      iconCls: 'favicon_icon',
      tooltip: document.title,
      handler: function () {
        window.location.search = '';
      }
    });
    query_bbar.addItem('>');
    query_bbar.addItem({
      text: Ext.util.Format.ellipsis(menu_item.mart_display_name, 20, true),
      tooltip: menu_item.mart_display_name,
      cls: 'x-btn-text-icon',
      iconCls: 'server_icon',
      handler: function () {
        window.location.search = '?server=' + menu_item.mart_name;
      }
    });
    query_bbar.addItem('>');
    query_bbar.addItem({
      text: Ext.util.Format.ellipsis(menu_item.dataset_display_name, 30, true),
      tooltip: menu_item.dataset_display_name,
      cls: 'x-btn-text-icon',
      iconCls: 'query_icon',
      handler: function () {
        window.location.search = '?server=' + menu_item.mart_name + '&query=' + menu_item.dataset_name;
      }
    });
    query_bbar.addItem('>');
    query_bbar.addItem({
      text: Ext.util.Format.ellipsis('default', 20, true),
      tooltip: 'default',
      cls: 'x-btn-text-icon',
      iconCls: 'form_icon',
      handler: function () {
        window.location.search = '?server=' + menu_item.mart_name + '&query=' + menu_item.dataset_name + '&form=default';
      }
    });
    var chromosome_list = new Ext.data.SimpleStore({
      fields: ['id', 'chromosome'],
      data: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['X', 'X'], ['Y', 'Y']]
    });
    query.removeAll();
    query.add([{
      xtype: 'fieldpanel',
      anchor: '100%',
      border: false,
      layout: 'anchor',
      fieldLabel: 'Ensembl Gene IDs',
      items: [{
        xtype: 'textarea',
        anchor: '100%'
      },
      {
        xtype: 'fileuploadfield',
        buttonText: '',
        anchor: '100%',
        buttonCfg: {
          iconCls: 'file_upload_icon'
        }
      }]
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
    viewport.doLayout();
    //.setText(menu_item.parentMenu.getText() + ' &sdot; ' + menu_item.getText());
  };

  // event listeners
  var query_tbar = query.getTopToolbar();
  query_tbar.items.get('submit').on('click', function () {

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
    results.selectView();
    results.doLayout();
  });

  var results_tbar = results.getTopToolbar();
  results_tbar.items.get('customize').on('click', function () {
    attributes.show();
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
