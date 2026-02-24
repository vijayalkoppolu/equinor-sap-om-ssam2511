import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../../Common/FLLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FLLibrary from '../../Common/FLLibrary';


export const HU_DEL_ITEMS_OPEN_FILTER = `ContainerItemStatus ne '${ContainerItemStatus.Received}' and ContainerItemStatus ne '${ContainerItemStatus.NotFound}'`;
export const HU_DEL_ITEMS_RECEIVED_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.Received}'`;
export const HU_DEL_ITEMS_NOTFOUND_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.NotFound}'`;

export default function HUDelItemsOnLoadQuery(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('Material');
    queryBuilder.expand('FldLogsHUDelItemStatus_Nav');
    let filterLength = 0;

    const page = CommonLibrary.getPageName(context);
    if (context.filters) {
        filterLength = context?.filters[0].filterItemsDisplayValue?.length;
    }
    
    context.evaluateTargetPath('#Page:' + page).getFioriToolbar()?.setVisible((!(filterLength > 1)));

    return HUDelItemsListFilterAndSearchQuery(context, true, false).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        if (CommonLibrary.getPageName(context) === 'FLOverviewPage') {
            return FLLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'FldLogsHuDelItems', 2);
        }
        return queryBuilder;
    });
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for HUDelItems 
 */
function getHUDelItemsSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Material', 'ReferenceDocNumber','HandlingUnitID', 'VoyageNumber','ShippingPoint'];
        ModifyListViewSearchCriteria(context, 'FldLogsHuDelItems', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for HUDelItems with/without filter and search
 */
export function HUDelItemsListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const voyageNumber = context.getPageProxy().binding?.VoyageNumber;
    const defaultFilterString = voyageNumber ? `$filter=(VoyageNumber eq '${voyageNumber}')` : '';

    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getHUDelItemsSearchQuery(context, context.searchString.toLowerCase()));
    }

    return removeHUDelItemsDeletedItems(context, '', 'VOY').then(discardFilterStringVOY => {
        return removeHUDelItemsDeletedItems(context, discardFilterStringVOY, 'HDI').then(discardFilterStringHDI => {
            if (discardFilterStringHDI) {
                filterOptions.push(discardFilterStringHDI);
            }
            const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce(function(filterString, filterOption) {
                return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
            }, defaultFilterString);
            return finalFilterString;
        });
    });
}

/**
 * 
 * @param {*} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
       return `(${HU_DEL_ITEMS_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}

/**
 * 
 * @param {*} context 
 * @param {*} baseQueryFilter 
 * @param {*} objectType 
 * @returns Filter string for deleted items
 */
export function removeHUDelItemsDeletedItems(context, baseQueryFilter, objectType) {
    let filterString = `$filter=Action eq 'D' and ObjectType eq '${objectType}'&$orderby=ObjectId`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], filterString).then(results => {
        if (ValidationLibrary.evalIsEmpty(results)) {
            return baseQueryFilter;
        }
            const terms = results.map(result => {
                const ObjectId = result.ObjectId;
                if (objectType === 'VOY') {
                    let objectId = ObjectId.slice(0, -4);
                    return `VoyageUUID ne '${objectId}'`;
                } else {
                    const dispatchLoc = ObjectId.substring(0, 4);
                    const dispatchDate = ObjectId.substring(4, 12);
                    const parts = ObjectId.split('/');
                    const referenceDocNumber = parts[0].slice(-10) + '/' + parts[1];
                    const year = dispatchDate.substring(0, 4);
                    const month = dispatchDate.substring(4, 6);
                    const day = dispatchDate.substring(6, 8);
                    const formattedDispatchDate = `${year}-${month}-${day}T00:00:00`;
                   return `(DispatchLoc ne '${dispatchLoc}' or DispatchDate ne datetime'${formattedDispatchDate}' or ReferenceDocNumber ne '${referenceDocNumber}')`;
                }
            }).join(' and ');   
        return baseQueryFilter ? `${baseQueryFilter} and ${terms}` : terms;
    });
}

