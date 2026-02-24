import FilterOnLoaded from '../../../Filter/FilterOnLoaded';

/**
* On loaded event for Warehouse Order search filter
* @param {IClientAPI} clientAPI
*/
export default function WarehouseOrderSearchFilterOnLoaded(context) {
    // Default filter on loaded handler
    FilterOnLoaded(context); 
}
