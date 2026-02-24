import FilterLibrary from '../../Filter/FilterLibrary';

/**
 * Show or hide the filter button in the action bar for Inventory Tabbed pages
 * @param {IClientAPI} context
 */
export default function SetVisibleFilterButton(context) {
    if (context.constructor.name === 'TabItemProxy') {
        const pageName = context.getPageProxy()._page._definition.name;
        const handlers = { 
            'ProductionOrderDetails': 'ComponentsListTab', 
            'InboundOverview': 'AllDocumentsListTab',
            'OutboundOverview': 'AllDocumentsListTab',
            undefined: 'ItemsListTab',
        };
        const pagePreviousName = context.getPageProxy().evaluateTargetPath('#Page:-Previous')._definition.name;
        const tabVisibleFilterButtonName = handlers[Object.keys(handlers).find(a => a === pagePreviousName)];
        const isVisible = tabVisibleFilterButtonName === context._control._name;
        FilterLibrary.setVisibleFilterButton(context, pageName, isVisible);
    }
}
