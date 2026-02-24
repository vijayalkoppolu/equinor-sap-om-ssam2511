import { UpdateSerialNumberMap, GetSerialNumberMap } from './SerialNumberLib';
/**
 * Get Serial Numbers caption
 * @param {IClientAPI} context 
 * @returns Promise<any>
 */
export default async function SerialNumberOnBack(context) {
    if (compareSerialNumberMaps(context)) {
        // If the serial number map has not changed, just return
        return Promise.resolve(true);
    }
    // If the serial number map has changed, show a message to the user
    // and ask if they want to lose the changes
    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/SerialNumber/SerialNumberOkCancelMessage.action').then((result) => {
        if (result.data) {
            UpdateSerialNumberMap(context, context.getPageProxy().getClientData().serialNumberMapSave);
            // Remove the serial number map from the context
            context.getPageProxy().getClientData().serialNumberMapSave = undefined;
            return true;
        }
        return false;
    });
}

/**
 * Compare the serial number maps to see if they are equal
 * @param {IClientAPI} context 
 * @returns true if the serial number maps are equal
 * @description Compare the serial number maps to see if they are equal
 * @note This is used to determine if the serial number map has changed
 */
function compareSerialNumberMaps(context) {
    const compareMaps = (x, y) => {
        return JSON.stringify(x) === JSON.stringify(y);
      }; 
    return compareMaps(GetSerialNumberMap(context), context.getPageProxy().getClientData().serialNumberMapSave);
}
