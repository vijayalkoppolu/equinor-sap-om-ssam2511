import { GetSerialNumberMap, UpdateControls } from './SerialNumberLib';
/**
 * Update all serial numbers to be selected and update/redraw controls if affected
 * @param {ClientAPI} context 
 * @returns Promise
 */
export default async function AcceptAllSerialNumbers(context) {
    const serialNumberMap = GetSerialNumberMap(context);
    const quantityFromTask = parseInt(context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').binding.Quantity);
    if (quantityFromTask === serialNumberMap.length) {
        return Promise.resolve(serialNumberMap.reduce((result, e) => { 
            const item = !(e.usedInOtherConfirmation || e.selected);
            if (item) {
                e.selected = true;
            } 
            return result || (result || item); 
        }, false) ? UpdateControls(context, serialNumberMap) : false);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/AcceptAllErrorMsg.action');
    }
}

