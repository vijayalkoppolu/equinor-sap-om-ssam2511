import { ContainersListFilterAndSearchQuery } from '../Containers/ListView/ContainersListQueryOptions';
import { PackagesListFilterAndSearchQuery } from '../Packages/PackagesOnLoadQuery';
import { VoyagesListFilterAndSearchQuery } from '../Voyages/VoyagesOnLoadQuery';
import { HUDelItemsListFilterAndSearchQuery } from '../HUDelItems/ListView/HUDelItemsOnLoadQuery';

/**
 * Count different objects on the Overview page
 * @param {IClientAPI} context 
 * @returns the count of the objects
 */
export default function FLOverviewAttributeLabel(context) {
    return Count(context)
        .then(count => {
            return count;
        })
        .catch(() => {
            return '';
        });
}

/**
 * Count implementation
 * @param {IClientAPI} context 
 * @returns the count of the objects
 */
function Count(context) {
    let entity = '';
    let filterPromise = Promise.resolve('');
    switch (context.getParent().getName())  {
        case 'FLHUDelItemsSection':
            entity = 'FldLogsHuDelItems';
            filterPromise = HUDelItemsListFilterAndSearchQuery(context);
            break;
        case 'FLWorkOrdersSection':
            entity = 'FldLogsWorkOrders';
            break;
        case 'FLPackagesSection':
            entity = 'FldLogsPackages';
            filterPromise = PackagesListFilterAndSearchQuery(context);
            break;
        case 'FLContainersSection':
            entity = 'FldLogsContainers';
            filterPromise = ContainersListFilterAndSearchQuery(context);
            break;
        case 'FLVoyagesSection':
            entity = 'FldLogsVoyages';
            filterPromise = VoyagesListFilterAndSearchQuery(context);
            break;
        default: 
            return '';
    }

    return filterPromise.then(filter => context.count('/SAPAssetManager/Services/AssetManager.service', entity, filter));

}
