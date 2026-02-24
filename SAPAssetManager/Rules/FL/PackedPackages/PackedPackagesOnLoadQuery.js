import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import { IN_PACKING_STATUS_FILTER } from './FLPackedPackageCaptionInPacking';

export const FILTER_DISPATCH = "FldLogsCtnIntTranspStsCode eq '20'";

export default function PackedPackagesOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsCtnPackageId_Nav', 'FldLogsCtnPkgPackingStatus_Nav', 'FldLogsPackCtnPkgItem_Nav', 'FldLogsPackCtnPkgVyg_Nav', 'FldLogsPlant_Nav');
    queryBuilder.orderBy('FldLogsContainerID');
    const page = CommonLibrary.getPageName(context);
    if (context?.filters !== undefined) {
        if (context?.filters[0]?._filterItems.length !== 1) {
            CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', false);
        } else {
            CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', false);
        }
    } else {
        CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', false);
    }

    return PackedPackagesFilterAndSearchQuery(context, true, false).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        return queryBuilder;
    });
}

export function PackedPackagesFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getPackedPackagesSearchQuery(context, context.searchString.toLowerCase()));
    }

    const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce((filterString, filterOption) => {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
    return Promise.resolve(finalFilterString);
}

export function getPackedPackagesSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['FldLogsContainerID', 'FldLogsVoyAssgmtStatusText', 'FldLogsCtnPackgStsText', 'FldLogsShptCtnIntTranspStsText', 'FldLogsContainerText', 'FldLogsContainerCategory', 'DeliveryDocument'];
        ModifyListViewSearchCriteria(context, 'FldLogsPackCtnPkdPkgs', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
        return `(${IN_PACKING_STATUS_FILTER})`;
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
