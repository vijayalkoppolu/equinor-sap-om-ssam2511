import { GetSerialNumberMap, GetSelectedCount, UpdateSerialNumberMap, UpdateControls } from './SerialNumberLib';

/**
 * Serial number on press event handler - select/unselect serial number
 * @param {IClientAPI} context 
 * @returns 
 */
export default function SerialNumberOnPress(context) {
    const serialNumberMap = GetSerialNumberMap(context);
    const quantityToConfirm = parseInt(context.evaluateTargetPath('#Page:-Current/#Control:QuantitySimple/#Value'));
    const target = context.getPageProxy().getActionBinding();
    const entry = serialNumberMap.find((item) => item.entry.SerialNumber === target.SerialNumber);
    if (entry && !entry.usedInOtherConfirmation && entry.downloaded) {
        if (!entry.selected) {
            if (quantityToConfirm - GetSelectedCount(serialNumberMap) > 0) {
                entry.selected = !entry.selected;
            } else {
                return;
            }
        } else {
            entry.selected = !entry.selected;
        }
        UpdateSerialNumberMap(context, serialNumberMap);
        UpdateControls(context, serialNumberMap);
    }
}
