import libCom from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
/**
 * This rule is used to get the serial numbers for the physical inventory count.
 */
export default async function SerialNumbersTarget(context) {
    const target = context.binding;
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers')?.actual;

    if (!serialNumbers) {
        let arr = [];
        let serialNumberNav = 'WarehousePhysicalInventoryItemSerial_Nav';
        let currentSerials = target[serialNumberNav];
        if (!ValidationLibrary.evalIsEmpty(currentSerials)) {
            currentSerials = currentSerials.filter(serial => serial.Selected);
            arr = currentSerials.map(item => {
                return {
                    SerialNumber: item.SerialNumber,
                    Selected: item.Selected,
                };
            });
        }
        libCom.setStateVariable(context, 'SerialNumbers', { actual: arr, initial: JSON.parse(JSON.stringify(arr)) });
        return arr;
    } else {
        return serialNumbers;
    }
}

