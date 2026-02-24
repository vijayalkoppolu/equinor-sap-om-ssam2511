import Logger from '../../Log/Logger';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import MaterialsSearchQueryOptions from './MaterialsSearchQueryOptions';

/**
 * Returns a localized caption for the offline stock section header, including the count of MaterialSLocs.
 * The caption differs for inventory clerks and vehicle stock users.
 * The count is determined using query options and filters from the current context.
 *
 * @param {IClientAPI} context
 * @returns {Promise<string>}
 */
export default function StockOfflineHeaderCaption(context) {
    const isInventoryClerk = EnableInventoryClerk(context);
    const sectionCaption = isInventoryClerk ? 'offline_stock_x' : 'offline_vehicle_stock_x';
    const queryString = getQueryOptionsForCount(context);

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', queryString)
        .then(count => {
            return context.localizeText(sectionCaption, [count || 0]);
        });
}

function getFiltersStringFromSectionedTable(context) {
    try {
        const sectionedTableProxy = context.getParent()?.getParent();
        return sectionedTableProxy?.getFilterActionResult() || '';
    } catch (error) {
        Logger.error('Error getting filter action result:', error);
        return '';
    }
}

function getQueryOptionsForCount(context) {
    const targetSpecifierQueryOptions = context.getTargetSpecifier()?.getQueryOptions();
    const filterMatch = targetSpecifierQueryOptions.match(/\$filter=([^&]*)/);
    const targetSpecifierFilter = filterMatch?.[1];

    /**
     * Get the filters from filter action result and target specifier.
     * If target specifier query options is not a filter string, but a rule,
     * this means it's the first load of the page and we should use the default rule
     */
    if (targetSpecifierFilter) {
        const filterResultString = getFiltersStringFromSectionedTable(context);
        return filterResultString
            ? `${filterResultString} and ${targetSpecifierFilter}`
            : `$filter=${targetSpecifierFilter}`;
    }
    return MaterialsSearchQueryOptions(context, true);
}
