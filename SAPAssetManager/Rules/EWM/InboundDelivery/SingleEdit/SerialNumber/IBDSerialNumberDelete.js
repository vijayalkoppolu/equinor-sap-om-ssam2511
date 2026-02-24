import { GetIBDSerialNumbers, UpdateIBDControls, UpdateIBDSerialNumberMap } from './IBDSerialNumberLib';

export default function IBDSerialNumberDelete(context) {
    const map = GetIBDSerialNumbers(context);
    const newMap = map.filter(e => e.downloaded || e.entry.SerialNumber !== context.binding.SerialNumber);
    if (newMap.length !== map.length) {
        UpdateIBDSerialNumberMap(context, newMap);
        UpdateIBDControls(context, newMap);
    }
}
