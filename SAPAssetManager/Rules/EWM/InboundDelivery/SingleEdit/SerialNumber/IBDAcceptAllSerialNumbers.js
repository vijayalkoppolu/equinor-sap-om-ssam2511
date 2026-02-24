import { GetIBDSerialNumbers, UpdateIBDControls } from './IBDSerialNumberLib';

export default async function IBDAcceptAllSerialNumbers(context) {
    const serialNumberMap = GetIBDSerialNumbers(context);
        const quantityToConfirm = parseInt(context.evaluateTargetPath('#Page:-Previous/#Control:QuantityInput/#Value'));
        const serialQuantity = serialNumberMap.length;
    if (quantityToConfirm === serialQuantity) {
        // Track if any serial was newly selected
        let updated = false;
        for (const serial of serialNumberMap) {
            if (!serial.selected) {
                serial.selected = true;
                updated = true;
            }
        }

        // If any were updated, update controls; otherwise, return false
        if (updated) {
            return UpdateIBDControls(context, serialNumberMap);
        } else {
            return false;
        }
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/AcceptAllErrorMsg.action');
    }
}
