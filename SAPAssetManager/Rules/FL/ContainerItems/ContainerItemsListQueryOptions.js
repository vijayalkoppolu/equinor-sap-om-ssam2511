import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ContainerItemStatus } from '../Common/FLLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';

export const CONTAINER_ITEMS_OPEN_FILTER = `ContainerItemStatus ne '${ContainerItemStatus.Received}' and ContainerItemStatus ne '${ContainerItemStatus.NotFound}'`;
export const CONTAINER_ITEMS_RECEIVED_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.Received}'`;
export const CONTAINER_ITEMS_NOT_FOUND_FILTER = `ContainerItemStatus eq '${ContainerItemStatus.NotFound}'`;

/**
 * 
 * @param {*} context 
 * @returns Filter Query for Container Items
 */
export default async function ContainerItemsListQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('FldLogsContainerItemStatus_Nav,FldLogsHandlingDecision_Nav');
    const page = CommonLibrary.getPageName(context);
    const ContainerItems = context?.binding?.FldLogsContainerItem_Nav;
    const openFilterStatus = ['40','70'];
    const openContainerItems = ContainerItems.filter(item => !openFilterStatus.includes(item.ContainerItemStatus));
    let filterLength = 0;
  
    if (context.filters) {
      filterLength = context?.filters[0].filterItems?.length;
      context.evaluateTargetPath('#Page:' + page).getFioriToolbar()?.setVisible((!(filterLength > 1)));
      const filter = context?.filters[0]?.filterItems[0];
      const voyageStatus = await voyageStatusCode(context);

      if (filter === CONTAINER_ITEMS_OPEN_FILTER && filterLength === 1 && openContainerItems.length !== 0 && (!voyageStatus || voyageStatus === '02')) {
            CommonLibrary.switchToolBarVisibility(context, page, 'ReceiveAll', true);
            CommonLibrary.enableToolBar(context, page, 'ReceiveAll', true);
            CommonLibrary.switchToolBarVisibility(context,page,'EditAll', true);
            CommonLibrary.enableToolBar(context,page,'EditAll', true);
      } else {
        CommonLibrary.enableToolBar(context, page, 'ReceiveAll', false);
        CommonLibrary.enableToolBar(context,page,'EditAll', false);
        CommonLibrary.enableToolBar(context, page, 'NotFoundItem', false);
      }   
    } else {
        context.evaluateTargetPath('#Page:' + page).getFioriToolbar()?.setVisible(false);
    }

    const filterQuery = ContainerItemsListFilterAndSearchQuery(context, true, false);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }
    //filter refresh
    const currentFilters = context.filters;
    context.filters = currentFilters;
    const section = context.getSection('ContainerItemsSectionObjectTable');
    if (section) {
        section.redraw(true);
    }
    context.redraw();
    return queryBuilder;
}

/**
 * 
 * @param {*} context 
 * @param {*} searchString 
 * @returns Search Query for Container Items
 */
export function getContainerItemsSearchQuery(context, searchString) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['Material', 'VoyageNumber', 'HandlingUnitID', 'ReferenceDocNumber', 'SourceStage'];
        ModifyListViewSearchCriteria(context, 'FldLogsContainerItems', searchByProperties);
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}

/**
 * 
 * @param {*} context 
 * @param {*} addFilterAndSearch 
 * @returns Filter Query for Container Items with/without filter and search
 */
export function ContainerItemsListFilterAndSearchQuery(context, addSearch = false, addFilter = false) {
    const containerID = context.getPageProxy().binding?.ContainerID;
    const defaultFilterString = containerID ? `$filter=(ContainerID eq '${containerID}')` : '';
    
    let filterOptions = [];
    if (addFilter) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (addSearch && context.searchString) {
        filterOptions.push(getContainerItemsSearchQuery(context, context.searchString.toLowerCase()));
    }
    return filterOptions.filter((filterOption => !!filterOption)).reduce(function(filterString, filterOption) {
        return CommonLibrary.attachFilterToQueryOptionsString(filterString, filterOption);
      }, defaultFilterString);
}

/**
 * 
 * @param {*} context 
 * @returns Currently set filters. In case of page onLoaded event, we should return the preselected filter.
 */
function getCurrentFilters(context) {
    if (ValidationLibrary.evalIsEmpty(context.getPageProxy().getControls())) {
       return `(${CONTAINER_ITEMS_OPEN_FILTER})`;     
    }
    return CommonLibrary.getFormattedQueryOptionFromFilter(context);
}

export function voyageStatusCode(context) {
    const voyageNumber = context.binding?.VoyageNumber;

    if (voyageNumber) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', [], `$filter=VoyageNumber eq '${voyageNumber}'`)
            .then(result => {
                if (result && result.length > 0) {
                    return result._array[0]?.VoyageStatusCode;
                }
                return null;
            })
            .catch(error => {
                Logger.error('Error reading FldLogsVoyages:', error);
            });
    } else {
        return Promise.resolve(null);
    }
}
