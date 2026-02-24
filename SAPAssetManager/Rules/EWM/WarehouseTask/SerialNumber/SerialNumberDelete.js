import { UpdateSerialNumberMap, GetSerialNumberMap, UpdateControls } from './SerialNumberLib';

/**
 * On swipe/delete action for serial number list
 * For the future development
 * @param {IClientAPI} context 
 */
export default function SerialNumberDelete(context) {
    const map = GetSerialNumberMap(context);
    const newMap = map.filter(e => e.downloaded || e.entry.SerialNumber !== context.binding.SerialNumber);
    if (newMap.length !== map.length) {
        UpdateSerialNumberMap(context, newMap);
        UpdateControls(context, newMap);
    }
}
