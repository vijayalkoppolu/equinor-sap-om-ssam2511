import { GetIBDSerialNumbers } from './IBDSerialNumberLib';

/**
 * Get Serial Numbers target
 * @param {IClientAPI} context 
 * @returns {Promise<SerialNumbersTarget>} Serial Numbers Target
 */
export default async function IBDSerialNumberTarget(context) {
    const serialNumbersMap = await GetIBDSerialNumbers(context);
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
                entry: item.entry,
                downloaded: item.downloaded,
                entityexist: item.entityexist,
            };
        });
    }
    return [];   
}
