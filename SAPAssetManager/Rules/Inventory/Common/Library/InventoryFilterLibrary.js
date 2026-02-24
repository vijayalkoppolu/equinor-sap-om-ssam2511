import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';
import libFilter from '../../../Filter/FilterLibrary';

/**
 * Common functionality for inventory filters
 */
export default class {
    /**
     * Get the lambda query prefix
     */
    static get LAMBDA_QUERY_PREFIX() {
        return 'wt:wt/';
    }

    /**
     * Populate the picket list for the specified entity set, query, property name and navigation entity
     * For example, EntityA and EntityB; EntityB has a navigation property to EntityA
     * GET EntityB?$expand=EntityA_Nav&$select=EntityA_Nav/Property
     * @param {IClientAPI} context 
     * @param {String} entitySet 
     * @param {String} queryOptions 
     * @param {String} navName
     * @param {String} propName 
     * @returns the list of unique values for the specified property of the entity set
     */
    static async ReadPickerItems(context, entitySet, queryOptions, propName, navName = null) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions)
            .then(o => [... new Set(Array.from(o, c => navName ? c[`${navName}`][`${propName}`] : c[`${propName}`]))]
            .map(uniqueValue => ({
                'DisplayValue': `${uniqueValue}`,
                'ReturnValue': `${uniqueValue}`,
            }))).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryInventoryFilter.global').getValue(), error);
                return [];
            });
    }
    
    /**
     * Correct the search string to include navigation entity
     * 
     * In order to correct the search string, we need to replace the property that belongs to list page "main"  entity with 
     * navigation entity with Entity_Nav/any(wt:wt/ and add a closing bracket ')'
     * Example: the $filter=ProcCategory eq '01' or ProcCategory eq '02' should be corrected to
     * $filter=WarehouseTask_Nav/any(wt:wt/ProcCategory eq '01' or wt/ProcCategory eq '02')
     * 
     * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
     * @param {Array} properties array of the properties to be corrected 
     * @param {String} navName the navigation entity name 
     * @returns the corrected search string
     */
    static GetCorrectedSearchFilters(context, properties, navName) {
    
        let searchFilter = libCom.getFormattedQueryOptionFromFilter(context);
    
        properties.forEach(v => {
            const start = searchFilter.indexOf('(' + v);
            if (-1 !== start) {
                const end = searchFilter.indexOf(')', start);
                let filterSection = searchFilter.substring(start, end + 1);
                filterSection = filterSection.replaceAll(v, `${navName}/any(${this.LAMBDA_QUERY_PREFIX}` + v).replaceAll(' or ', ') or ') + ')';
                searchFilter = searchFilter.replace(searchFilter.substring(start, end + 1), filterSection);
            }
        });
        
        Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryInventoryFilter.global').getValue(), 'Corrected search filter: ' + searchFilter);

        return searchFilter;
    }
    /**
     * Get sort filters for the page
     * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
     * @returns current sorting filters or default sorting filter
     */
    static GetSortfOptions(context, defaultOrderBy) {
        let result = defaultOrderBy;
        if (context.filters) {
            const sorter = context.filterTypeEnum.Sorter;
            const orderBy = context.filters.filter(v => v.type === sorter).map(fc => fc.filterItems).map(f => f).join(',');
            if (!libVal.evalIsEmpty(orderBy)) {
                result = orderBy;
            }
        }
        return result;
    }
    
    /**
     * Collect search filter results
     * @param {IClientAPI} context 
     * @param {Array} filterProps 
     * @param {String} formCellContainerName 
     * @param {String} sortByFilterName 
     * @returns 
     */    
    static GetSearchFilterResults(context, filterProps, formCellContainerName = 'FormCellContainer', sortByFilterName = 'SortFilter') {
        const formCellContainer = context.getControl(formCellContainerName);
        const sortByFilterValue = formCellContainer.getControl(sortByFilterName).getValue();
        libFilter.formatDescendingSorterDisplayText(sortByFilterValue);
        const filterResults = filterProps.map((n) => formCellContainer.getControl(n).getFilterValue());
        filterResults.push(sortByFilterValue);
        return filterResults;
    }
}
