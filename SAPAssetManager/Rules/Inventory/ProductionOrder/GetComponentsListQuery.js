import autoOpenMovementScreen from '../Search/AutoOpenMovementScreen';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
/**
 * Common rule to build queries for PRD components
 * @param {*} context PRD objects
 * @returns DataQueryBuilder
 */
export default function GetComponentsListQuery(context) {
    const sectionedTable = context.getPageProxy().getControls()[0];
    let queryBuilder = context?.dataQueryBuilder?.() || sectionedTable.dataQueryBuilder();
    queryBuilder.orderBy('ItemNum');

    let searchString = context.searchString;
    if (searchString) {
        searchString = context.searchString.toLowerCase();
    }

    // leaving this for perspective
    // let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    // if (type === 'ProductionOrderHeader') {}
    return getPRDComponentsQuery(context, queryBuilder, searchString);
}

function getPRDComponentsQuery(context, queryBuilder, searchString) {
    const orderId = context.binding?.OrderId || context.getPageProxy().getControl('SectionedTable').binding.OrderId;
    queryBuilder.filter("(OrderId eq '" + orderId + "')");
    queryBuilder.expand('MaterialPlant_Nav/Material', 'MaterialPlant_Nav', 'MaterialDocItem_Nav');
    const searchFilters = libCom.getFormattedQueryOptionFromFilter(context);
    if (libVal.evalIsNotEmpty(searchFilters)) {
        queryBuilder.filter(searchFilters);
    }
    if (searchString) {
        let searchStringFilters = [
            `substringof('${searchString}', tolower(OrderId))`,
            `substringof('${searchString}', tolower(ItemNum))`,
            `substringof('${searchString}', tolower(Batch))`,
            `substringof('${searchString}', tolower(StorageBin))`,
            `substringof('${searchString}', tolower(MaterialNum))`,
            `substringof('${searchString}', tolower(MaterialPlant_Nav/Material/Description))`,
        ];
        queryBuilder.filter('(' + searchStringFilters.join(' or ') + ')');
    }
    return autoOpenMovementScreen(context, 'ProductionOrderComponents', queryBuilder, searchString);
}
