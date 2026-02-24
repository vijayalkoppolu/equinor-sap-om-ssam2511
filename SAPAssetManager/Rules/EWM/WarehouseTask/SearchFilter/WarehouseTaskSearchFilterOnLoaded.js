import FilterOnLoaded from '../../../Filter/FilterOnLoaded';

/**
* On loaded event for Warehouse Task search filter
* @param {IClientAPI} clientAPI
*/
export default function WarehouseTaskSearchFilterOnLoaded(context) {
    // Default filter on loaded handler
    FilterOnLoaded(context); 
}
