import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
import libCom from  '../../../Common/Library/CommonLibrary';
/**
* Add Serial Number manually enter by the user to the list of serial numbers
* @param {IClientAPI} clientAPI
*/
export default function AddSerialNumber(context) {
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const serialPicker = sectionedTable.getControl('SerialNum');
    const newSerialNumber = serialPicker.getValue();
    if (!newSerialNumber) {
        return null;
    }
    const quantitySimple = sectionedTable.getControl('QuantitySimple');
    const quantityValue = quantitySimple.getValue();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    const actualNumbers = serialNumbers.actual || [];
    const existNumber = actualNumbers.find(item => item.SerialNumber === newSerialNumber);
    let TempLine_SerialNumbers = [];

    if (existNumber) {
        if (existNumber.Selected || existNumber.Description) {
            serialPicker.setValue('');
            return null;
        } else {
            existNumber.Selected = true;
        }
    } else {
        actualNumbers.unshift({
            SerialNumber: newSerialNumber,
            Selected: true,
            new: true,
        });
    }

    if (actualNumbers.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.Selected);
    }
    SerialNumDisable(context, TempLine_SerialNumbers.length < quantityValue);
    let totalCount = quantityValue - TempLine_SerialNumbers.length;
    const ScanButton = sectionedTable.getControl('ScanButton');
    ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
    libCom.setStateVariable(context, 'SerialNumbers', { actual: actualNumbers, initial: serialNumbers.initial });
    serialPicker.setValue('');
    sectionedTable.redraw();
}

