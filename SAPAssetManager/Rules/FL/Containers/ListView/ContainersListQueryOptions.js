import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ContainerStatus } from '../../Common/FLLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FLLibrary from '../../Common/FLLibrary';

export const CONTAINERS_OPEN_FILTER = `ContainerStatus ne '${ContainerStatus.Received}' and ContainerStatus ne '${ContainerStatus.NotFound}'`;
export const CONTAINERS_RECEIVED_FILTER = `ContainerStatus eq '${ContainerStatus.Received}'`;
export const CONTAINERS_NOTFOUND_FILTER = `ContainerStatus eq '${ContainerStatus.NotFound}'`;

/**
 * 
 * @param {*} context 
 * @returns Filter Query for Containers
 */
export default function ContainersListQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('ContainerID');
    queryBuilder.expand('FldLogsContainerStatus_Nav', 'FldLogsContainerItem_Nav', 'FldLogsPackage_Nav');
    const page = CommonLibrary.getPageName(context);
    let filterLength = 0;

    if (context.filters) {
        filterLength = context?.filters[0].filterItemsDisplayValue?.length;
    }
    
    context.evaluateTargetPath('#Page:' + page).getFioriToolbar()?.setVisible((!(filterLength > 1)));

    return ContainersListFilterAndSearchQuery(context, true, false).then(filterQuery => {
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    if (CommonLibrary.getPageName(context) === 'FLOverviewPage') {
        return FLLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'FldLogsContainers', 2);
    }
    return queryBuilder;
    });
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Containers
 */
export function getContainersSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['ContainerID', 'VoyageNumber', 'ShippingPoint', 'FldLogsContainerStatus_Nav/FldContainerStatusDescription'];
        ModifyListViewSearchCriteria(context, 'FldLogsContainers', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Containers with/without filter and search
 */
export function ContainersListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const voyageNumber = context.getPageProxy().binding?.VoyageNumber;
    const defaultFilterString = voyageNumber ? `$filter=(VoyageNumber eq '${voyageNumber}')` : '';

    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getContainersSearchQuery(context, context.searchString.toLowerCase()));
    }
    
    return removeContainerDeletedItems(context, '', 'VOY').then(discardFilterStringVOY => {
        return removeContainerDeletedItems(context, discardFilterStringVOY, 'CTN').then(discardFilterStringCTN => {
            if (discardFilterStringCTN) {
                filterOptions.push(discardFilterStringCTN);
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
       return `(${CONTAINERS_OPEN_FILTER})`;     
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
export function removeContainerDeletedItems(context, baseQueryFilter, objectType) {
    let filterString = `$filter=Action eq 'D' and ObjectType eq '${objectType}'&$orderby=ObjectId`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], filterString).then(results => {
        if (ValidationLibrary.evalIsEmpty(results)) {
            return baseQueryFilter;
        }
        const terms = Array.from(results, i => {
            let objectId = i.ObjectId;
            if (objectType === 'VOY') {
                objectId = objectId.slice(0, -4);
            }
            return objectType === 'VOY' ? `VoyageUUID ne '${objectId}'` : `ContainerID ne '${objectId}'`;
        }).join(' and ');
        return baseQueryFilter ? [baseQueryFilter, terms].join(' and ') : `${terms}`;
    });
}

