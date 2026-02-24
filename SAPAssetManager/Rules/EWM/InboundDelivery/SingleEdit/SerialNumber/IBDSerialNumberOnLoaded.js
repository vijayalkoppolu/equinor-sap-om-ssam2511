import { GetIBDSerialNumbers } from './IBDSerialNumberLib';

/**
 * Save Serial Numbers map to the context
 * @param {IClientAPI} context 
 * @returns 
 */
export default function IBDSerialNumberOnLoaded(context) {
    // Save the serial number map to the context - deep copy
    context.getPageProxy().getClientData().ibdserialNumberMapSave = JSON.parse(JSON.stringify(GetIBDSerialNumbers(context)));
}
