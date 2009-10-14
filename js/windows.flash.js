Ext.namespace('Martview.windows');

/* ------------
   Flash window
   ------------ */
Martview.windows.Flash = Ext.extend(Object, {
  show: function (type, message) {
    var icons = {
      'alert': './ico/exclamation.png',
      'error': './ico/cross-circle.png',
      'success': './ico/tick-circle.png',
      'info': './ico/information.png'
    };
    if (!this.flashCt) {
      this.flashCt = Ext.DomHelper.insertFirst(document.body, {
        id: 'flash'
      },
      true);
    }
    this.flashCt.alignTo(document, 't-t');
    var box = Ext.DomHelper.append(this.flashCt, {
      html: ['<div class="flash">', '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>', '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc">', '<table><tr><td><img src="', icons[type], '"/></td><td>&nbsp;</td><td>', message, '<td></tr></table></div></div></div>', '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>', '</div>'].join('')
    },
    true);
    // box.slideIn('t').pause(5).ghost("t", {
    //   remove: true
    // });
    box.slideIn('t');
    box.on('click', function () {
      this.ghost("t", {
        remove: true
      });
    });
  }
});
