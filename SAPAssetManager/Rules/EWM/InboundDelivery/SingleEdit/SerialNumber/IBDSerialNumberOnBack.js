import { GetIBDSerialNumbers, UpdateIBDSerialNumberMap } from './IBDSerialNumberLib';
/**
 * Get Serial Numbers caption
 * @param {IClientAPI} context 
 * @returns Promise<any>
 */
export default async function IBDSerialNumberOnBack(context) {
    if (compareSerialNumberMaps(context)) {
        return Promise.resolve(true);
    }

    return context.executeAction('/SAPAssetManager/Actions/EWM/WarehouseTasks/SerialNumber/SerialNumberOkCancelMessage.action').then((result) => {
        if (result.data) {
            UpdateIBDSerialNumberMap(context, context.getPageProxy().getClientData().ibdserialNumberMapSave);
            context.getPageProxy().getClientData().ibdserialNumberMapSave = undefined;
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
export function compareSerialNumberMaps(context) {
    const compareMaps = (x, y) => {
        return JSON.stringify(x) === JSON.stringify(y);
      }; 
    return compareMaps(GetIBDSerialNumbers(context), context.getPageProxy().getClientData().ibdserialNumberMapSave);
}
