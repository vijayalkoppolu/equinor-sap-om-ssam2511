import { GetSerialNumberMap } from './SerialNumberLib';

/**
 * Get Serial Numbers caption
 * @param {IClientAPI} context 
 * @returns 
 */
export default function SerialNumbersCaption(context) {
    const serialNumbersMap = GetSerialNumberMap(context);

    if (!serialNumbersMap || !serialNumbersMap.length) {
        return context.localizeText('serial_numbers');
    } else {
        const confirmed = serialNumbersMap.filter(item => item.selected || item.usedInOtherConfirmation).length;
        const total = serialNumbersMap.length;

        return context.localizeText('serial_numbers_x_x', [confirmed, total]);
    }
}
