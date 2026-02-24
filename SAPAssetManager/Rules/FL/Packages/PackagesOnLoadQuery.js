import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ContainerStatus } from '../Common/FLLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import FLLibrary from '../Common/FLLibrary';


export const PACKAGES_OPEN_FILTER = `ContainerStatus ne '${ContainerStatus.Received}' and ContainerStatus ne '${ContainerStatus.NotFound}'`;
export const PACKAGES_RECEIVED_FILTER = `ContainerStatus eq '${ContainerStatus.Received}'`;
export const PACKAGES_NOTFOUND_FILTER = `ContainerStatus eq '${ContainerStatus.NotFound}'`;

export default function PackagesOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('ContainerID');
    queryBuilder.expand('FldLogsPackageItem_Nav', 'FldLogsContainerStatus_Nav');
    let filterLength = 0;
    
    const page = CommonLibrary.getPageName(context);
    if (context.filters) {
        filterLength = context?.filters[0].filterItemsDisplayValue?.length;
    }
    
    context.evaluateTargetPath('#Page:' + page).getFioriToolbar()?.setVisible((!(filterLength > 1)));

    return PackagesListFilterAndSearchQuery(context, true, false).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        if (CommonLibrary.getPageName(context) === 'FLOverviewPage') {
            return FLLibrary.onOverviewPageSectionLoad(context, queryBuilder, filterQuery, 'FldLogsPackages', 2);
        }
        return queryBuilder;
    });
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Packages
 */
function getPackagesSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['ContainerID', 'SupplierNo', 'ShippingPoint', 'FldLogsContainerStatus_Nav/FldContainerStatusDescription'];
        ModifyListViewSearchCriteria(context, 'FldLogsPackages', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Packages with/without filter and search
 */
export function PackagesListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
            const containerID = context.getPageProxy().binding?.ContainerID;
            const voyageNumber = context.getPageProxy().binding?.VoyageNumber;
        
            let defaultFilterString = '';
        
            if (containerID) {
                defaultFilterString = `$filter=(ParentCtnID eq '${containerID}')`;
            } else if (voyageNumber) {
                // Exclude records where ParentCtnID is not null or empty
                defaultFilterString = `$filter=(VoyageNumber eq '${voyageNumber}' and (ParentCtnID eq null or ParentCtnID eq ''))`;
            }

    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getPackagesSearchQuery(context, context.searchString.toLowerCase()));
    }

    return removePackageDeletedItems(context, '', 'VOY').then(discardFilterStringVOY => {
    return removePackageDeletedItems(context, discardFilterStringVOY, 'CTN').then(discardFilterStringCTN => {
        return removePackageDeletedItems(context, discardFilterStringCTN, 'PKG').then(discardFilterStringPKG => {
            if (discardFilterStringPKG) {
                filterOptions.push(discardFilterStringPKG);
            }
            const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce(function(filterString, filterOption) {
                return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
            }, defaultFilterString);
            return finalFilterString;
        });
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
       return `(${PACKAGES_OPEN_FILTER})`;     
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
export function removePackageDeletedItems(context, baseQueryFilter, objectType) {
    let filterString = `$filter=Action eq 'D' and ObjectType eq '${objectType}'&$orderby=ObjectId`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], filterString).then(results => {
        if (ValidationLibrary.evalIsEmpty(results)) {
            return baseQueryFilter;
        }
        const terms = Array.from(results, i => i.ObjectId)
            .map(ObjectId => {
                if (objectType === 'VOY') {
                    let objectId = ObjectId.slice(0, -4);
                    return `VoyageUUID ne '${objectId}'`;
                } else if (objectType === 'CTN') {
                    return `ParentCtnID ne '${ObjectId}'`;
                } else {
                    return `ContainerID ne '${ObjectId}'`;
                }
            }).join(' and ');
        return baseQueryFilter ? [baseQueryFilter, terms].join(' and ') : `${terms}`;
    });
}

