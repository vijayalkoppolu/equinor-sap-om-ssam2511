import libCom from '../../../../Common/Library/CommonLibrary';
import Logger from '../../../../Log/Logger';
import ModifyListViewSearchCriteria from '../../../../LCNC/ModifyListViewSearchCriteria';
import EWMLibrary from '../../../Common/EWMLibrary';
export const HANDLING_UNIT_DEFAULT_ORDERBY = 'Header_Nav/HandlingUnit';

export default function WHHandlingUnitListQuery(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('Header_Nav/HandlingUnitItem_Nav/InboundDeliveryItem_Nav');
    queryBuilder.orderBy(HANDLING_UNIT_DEFAULT_ORDERBY);
    try {
            EWMLibrary.setSearchString(context);
        } catch (error) {
            Logger.error('HandlingUnit', error);
        }
    const filterQuery = WHHandlingUnitFilterAndSearchQuery(context, true);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    return queryBuilder;
}

/** create the filter and search query for the Handling Unit List */
export function WHHandlingUnitFilterAndSearchQuery(context, addSearch = false) {
    const filterOptions = [];
    const deliveryitem = context.getPageProxy()?.binding?.ItemID;
    let defaultFilterString = '';

    if (deliveryitem) {
        defaultFilterString += `$filter=(RefItemId eq '${deliveryitem}')`;
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getWHHandlingUnitSearchQuery(context, context.searchString.toLowerCase()));
    }
    return filterOptions.filter((filterOption => !!filterOption)).reduce((filterString, filterOption) => {
        return libCom.attachFilterToQueryOptionsString(filterString, filterOption);
    }, defaultFilterString);
}

/**
 * Get the search query for Handling Units
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @param {String} searchString 
 * @returns Search Query Handling Units
 */
export function getWHHandlingUnitSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = [
            'Header_Nav/HandlingUnit',
            'Header_Nav/PackingMaterialDesc',
            'Header_Nav/PackingMaterial',
            'Header_Nav/HUType',
        ];
        ModifyListViewSearchCriteria(context, 'HandlingUnitItem', searchByProperties);
        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}
