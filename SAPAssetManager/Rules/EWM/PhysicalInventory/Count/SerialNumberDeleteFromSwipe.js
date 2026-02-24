import IsAndroid from '../../../Common/IsAndroid';
import libCom from '../../../Common/Library/CommonLibrary';
import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
/**
 * Delete the serial number on swipe action
 */
export default function SerialNumberDeleteFromSwipe(context) {
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const target = context.getPageProxy().getActionBinding();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    let TempLine_SerialNumbers = [];
    const changedSerialNumbers = serialNumbers.actual.filter(
        (item) => item.SerialNumber !== target.SerialNumber,
    );
    const quantityValue = sectionedTable.getControl('QuantitySimple').getValue();

    if (changedSerialNumbers.length) {
        TempLine_SerialNumbers = changedSerialNumbers.filter(item => item.Selected);
    }
    SerialNumDisable(context, TempLine_SerialNumbers.length < quantityValue);
    libCom.setStateVariable(context, 'SerialNumbers', {
        actual: changedSerialNumbers,
        initial: serialNumbers.initial,
    });
    let totalCount = quantityValue - TempLine_SerialNumbers.length;
    const ScanButton = sectionedTable.getControl('ScanButton');
    ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));
    sectionedTable.getSection(
            `${IsAndroid(context)
                ? 'SerialNumbersObjectTableAndroid'
                : 'SerialNumbersObjectTable'
            }`,
        )
        .redraw();
}
