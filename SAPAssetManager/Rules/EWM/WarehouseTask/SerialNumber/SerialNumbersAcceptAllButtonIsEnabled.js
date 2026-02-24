import { GetSerialNumberMap, GetQuantityToConfirmFromConfirmationPage } from './SerialNumberLib';
/**
 * Enable/disable Update all serial numbers to be selected and update/redraw controls if affected
 * @param {ClientAPI} context 
 * @returns true if enabled
 */
export default async function AcceptAllSerialNumbersIsEnabled(context) {
    const serialNumberMap = GetSerialNumberMap(context);
    const quantityToConfirm = GetQuantityToConfirmFromConfirmationPage(context);
    const availableQuantity = serialNumberMap.reduce((result, e) => { 
        return result += !(e.usedInOtherConfirmation) ? 1 : 0;
    }, 0);
    return parseFloat(quantityToConfirm) === parseFloat(availableQuantity);
}

