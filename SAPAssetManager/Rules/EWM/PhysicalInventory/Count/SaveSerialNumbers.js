import libCom from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';
/**
 * Save the serial numbers into state variables and close the modal
 */
export default function SaveSerialNumbers(context) {
    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const QuantitySimple = sectionedTable.getControl('QuantitySimple');
    let TempLine_SerialNumbers = [];
    if (actualNumbers.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.Selected);
    }

    let QuantityInBaseUOM = 0;
    let serialCount = libLocal.toNumber(context, TempLine_SerialNumbers.length);
    let quantityValue = libLocal.toNumber(context, QuantitySimple.getValue());
    libCom.setStateVariable(context, 'Quantity', quantityValue);

    QuantityInBaseUOM = quantityValue;
    if (serialCount !== QuantityInBaseUOM) {
        let message = context.localizeText('serial_number_count', [serialCount, QuantityInBaseUOM]);
        libCom.executeInlineControlError(context, QuantitySimple, message);
        return '';
    } else {
        libCom.setStateVariable(context, 'SerialSuccess', 'X');
        libCom.setStateVariable(context, 'SerialNumbers', { actual: actualNumbers, initial: JSON.parse(JSON.stringify(actualNumbers)) });
        return context.executeAction('/SAPAssetManager/Actions/Inventory/SerialNumbers/SerialNumberCloseModal.action');
    }

}

