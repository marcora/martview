// add the getText method to Ext.menu.item to match the setText method
Ext.override(Ext.menu.BaseItem, {
    getText: function () {
        return this.el.select('span.x-menu-item-text').first().dom.innerHTML;
    }
});

// add the getText method to Ext.menu.Menu to match the setText method
Ext.override(Ext.menu.Menu, {
    getText: function () {
        return this.el.select('span.x-menu-item-text').first().dom.innerHTML;
    }
});

