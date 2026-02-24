import { GetSerialNumberScanEnabled } from './SerialNumberLib';

/**
 * Scan serial number button enabled based on the number of unselected serial numbers
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns 
 */
export default function SerialNumberScanEnabled(context) {
    return GetSerialNumberScanEnabled(context);
}
