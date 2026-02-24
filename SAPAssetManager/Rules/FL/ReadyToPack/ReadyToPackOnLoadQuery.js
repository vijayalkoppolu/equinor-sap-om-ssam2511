import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import { AVAILABLE_FOR_PACK_STATUS_FILTER } from './FLReadyToPackFilterCaptionAvailableForPacking';

export const FILTER_DISPATCH = "FldLogsShptItmStsCode eq '30'";

export default function ReadyToPackOnLoadQuery(context) {

    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsPackCtnItemStatus_Nav', 'FldLogsCtnPackageId_Nav', 'FldLogsOrderCategory_Nav', 'FldLogsPlant_Nav');
    queryBuilder.orderBy('Material');
    const page = CommonLibrary.getPageName(context);
    if (context?.filters !== undefined) {
        if (context?.filters[0]?._filterItems.length !== 1) {
            CommonLibrary.enableToolBar(context, page, 'EditAll', false);
            CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', false);
        } else if (context?.filters[0]?._filterItems.length === 1 && context?.filters[0]?._filterItems[0] !== FILTER_DISPATCH) {
            CommonLibrary.enableToolBar(context, page, 'EditAll', true);
        } else {
            CommonLibrary.enableToolBar(context, page, 'EditAll', false);
            CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', false);
        }
    } else {
        CommonLibrary.enableToolBar(context, page, 'EditAll', false);
        CommonLibrary.enableToolBar(context, page, 'AssignToContainerButton', false);
    }


    return ReadyToPackListFilterAndSearchQuery(context, true, false).then(filterQuery => {
        if (filterQuery) {
            queryBuilder.filter(filterQuery.replace('$filter=', ''));
        }
        return queryBuilder;
    });
}

export function ReadyToPackListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getReadyToPackSearchQuery(context, context.searchString.toLowerCase()));
    }

    const finalFilterString = filterOptions.filter(filterOption => !!filterOption).reduce((filterString, filterOption) => {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
    return Promise.resolve(finalFilterString);
}

export function getReadyToPackSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['Material', 'MaterialName', 'DeliveryDocument', 'FldLogsSrcePlnt', 'FldLogsDestPlnt', 'HandlingUnitExternalId', 'FldLogsVoyAssgmtStatusText'];
        ModifyListViewSearchCriteria(context, 'FldLogsPackCtnRdyPcks', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
        return `(${AVAILABLE_FOR_PACK_STATUS_FILTER})`;
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}
