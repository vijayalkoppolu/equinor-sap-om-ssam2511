import { GetSerialNumberMap } from './SerialNumberLib';

/**
 * Get Serial Numbers target
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns {Promise<SerialNumbersTarget>} Serial Numbers Target
 */
export default async function SerialNumberTarget(context) {
    const serialNumbersMap = await GetSerialNumberMap(context);
    return serialNumberTargetImpl(serialNumbersMap);
}
/**
 * Create Serial Number Target from supplied Map
 * @param {Array<Object>} serialNumbersMap 
 * @returns {Array<Object>} Serial Numbers Target
 */
export function SerialNumberTargetMap(serialNumbersMap) {
    return serialNumberTargetImpl(serialNumbersMap);
}

/**
 * Create Serial Number Target implementation
 * @param {Array<Object>} serialNumbersMap 
 * @returns {Array<Object>} Serial Numbers Target
 */
function serialNumberTargetImpl(serialNumbersMap) {
    if (serialNumbersMap) {
        return serialNumbersMap.map(item => {
            return { 
                SerialNumber : item.entry.SerialNumber, 
                selected: item.selected,
                downloaded: item.downloaded,
                entry: item.entry,
                usedInOtherConfirmation: item.usedInOtherConfirmation,
            };
        });
    }
    return [];   
}
