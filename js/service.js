Ext.namespace('Martview');

Martview.Service = function (params) {
  self.dataset = params.dataset;
  self.filters = params.filters;
  self.attributes = params.attributes;

  var datastore;
  var conn = new Ext.data.Connection();

  conn.request({
    url: '',
    success: function (response) {},
    failure: function () {}
  });
}
