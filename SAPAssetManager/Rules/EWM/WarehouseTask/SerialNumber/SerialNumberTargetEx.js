import { SetSerialNumberMapForDisplay } from './SerialNumberLib';
import { SerialNumberTargetMap } from './SerialNumberTarget';

/**
 * Get Serial Numbers target
 * @param {import('../../../../.typings/IClientAPI').IClientAPI} context 
 * @returns Serial Numbers Target
 */
export default async function SerialNumberTargetEx(context) {
    const serialNumberMap = await SetSerialNumberMapForDisplay(context);
    return SerialNumberTargetMap(serialNumberMap);
}
