import { CONTAINER_ITEMS_OPEN_FILTER } from '../../FL/ContainerItems/ContainerItemsListQueryOptions';
import { PACKAGE_ITEMS_OPEN_FILTER } from '../PackageItems/PackageItemsOnLoadQuery';
export const HeaderToItemsEntitySetName = {
    'FldLogsContainer'       : 'FldLogsContainerItems',
    'FldLogsPackage'         : 'FldLogsPackageItems',
};

export function GetOpenItemsQuery(type) {
    let query;
    switch (type) {
        case 'FldLogsContainerItems':
            query = CONTAINER_ITEMS_OPEN_FILTER;
            break;
        case 'FldLogsPackageItems':
            query = PACKAGE_ITEMS_OPEN_FILTER;
            break;
    }
    return query;
}
export function GetOpenItemsTargetQuery(parentEntity, parentData) {

    const target = HeaderToItemsEntitySetName[parentEntity];
    const openItemsQuery = GetOpenItemsQuery(target);
    let query = '';
    switch (target) {
        case 'FldLogsContainerItems':      
        case 'FldLogsPackageItems':
            query = `$filter=(ContainerID eq '${parentData.ContainerID}' and DispatchDate eq datetime'${parentData.DispatchDate}' 
            and DispatchLoc eq '${parentData.DispatchLoc}' and TripCounter eq '${parentData.TripCounter}')`;
            break;
    }

    if (openItemsQuery) {
        query += ` and ${openItemsQuery}`;
    }
    return {target, query};
}
export function GetEDTControls(context) {
    let sections;
    try {     
        sections = context.getPageProxy().getControls()[0].getSections();
    } catch (e) {
        sections = context.currentPage.context._clientAPI.getControls()[0].getSections();
    }
    let controlsArray = [];
    for (let index = 2; index < sections.length; index += 2) {
        controlsArray.push(sections[index].getExtension());
    }
    return controlsArray;
}
