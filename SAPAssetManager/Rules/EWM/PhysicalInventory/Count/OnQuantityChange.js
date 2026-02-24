import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';
/**
* Set the scan count and visibility on quantity change
* @param {IClientAPI} context
*/
export default function OnQuantityChange(context) {
    let TempLine_SerialNumbers = [];
    let quantity = 0;
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    quantity = sectionedTable ? libLocal.toNumber(context, sectionedTable.getControl('QuantitySimple').getValue()) : context.binding.Quantity;
    if (isNaN(quantity)) {
        quantity = 0;
    }
    const serialNumbers = CommonLibrary.getStateVariable(context, 'SerialNumbers');
    const actualNumbers = serialNumbers.actual || [];
    TempLine_SerialNumbers = actualNumbers.filter(item => item.Selected);
    if (libLocal.isNumber(context, quantity)) {
        let totalCount = quantity - TempLine_SerialNumbers.length;
        const ScanButton = sectionedTable.getControl('ScanButton');
        ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
        SerialNumDisable(context, TempLine_SerialNumbers.length < quantity);
    }
}
