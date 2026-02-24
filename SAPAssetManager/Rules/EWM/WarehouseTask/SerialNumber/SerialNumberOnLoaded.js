import { GetSerialNumberMap } from './SerialNumberLib';

/**
 * Save Serial Numbers map to the context
 * @param {IClientAPI} context 
 * @returns 
 */
export default function SerialNumberOnLoaded(context) {
    // Save the serial number map to the context - deep copy
    context.getPageProxy().getClientData().serialNumberMapSave = JSON.parse(JSON.stringify(GetSerialNumberMap(context)));
}
