import libCom from '../../../Common/Library/CommonLibrary';
/**
* Get the Scan button caption
* @param {IClientAPI} clientAPI
*/
export default function ScanCaption(context) {
    const { quantityValue, serialLength } = GetQuantityAndSerialNumbers(context);
    return GetSerialNumberCaption(context, quantityValue, serialLength);

}
export function GetQuantityAndSerialNumbers(context) {
    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers')?.actual || context.binding.WarehousePhysicalInventoryItemSerial_Nav;
    let TempLine_SerialNumbers = [];
    if (actualNumbers?.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.Selected);
    }
    const serialLength = TempLine_SerialNumbers?.length || 0;
    let quantityValue = 0;
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    quantityValue = sectionedTable 
    ? Number(sectionedTable.getControl('QuantitySimple').getValue()) 
    : (context.binding.Quantity || 0);
    return { quantityValue, serialLength };
}

export function GetSerialNumberCaption(context, quantityValue, length) {
    const totalCount = quantityValue ? (quantityValue - length) : 0;
    return context.localizeText('scan_serial_number', [totalCount]);
}
