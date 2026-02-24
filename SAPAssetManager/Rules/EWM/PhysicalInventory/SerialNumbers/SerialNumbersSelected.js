import libCom from '../../../Common/Library/CommonLibrary';
import SerialNumDisable from '../../../Inventory/SerialNumbers/SerialNumDisable';
import IsAndroid from '../../../Common/IsAndroid';
/**
 * This function toggles the selected state of a serial number
 */
export default function SerialNumbersSelected(context) {
    const target = context.getPageProxy().getActionBinding();
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers');
    let TempLine_SerialNumbers = [];
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const quantityValue = sectionedTable.getControl('QuantitySimple').getValue();

    if (!Number(quantityValue) && !target.Selected) {
        return null;
    }

    const actualNumbers = serialNumbers.actual.map((item) => {
        if (item.SerialNumber === target.SerialNumber) {
            item.Selected = !item.Selected;
        }
        return item;
    });

    if (actualNumbers.length) {
        TempLine_SerialNumbers = actualNumbers.filter(item => item.Selected);
    }
    SerialNumDisable(context, TempLine_SerialNumbers.length < quantityValue);

    let totalCount = quantityValue - TempLine_SerialNumbers.length;
    const ScanButton = sectionedTable.getControl('ScanButton');
    ScanButton.setTitle(context.localizeText('scan_serial_number', [totalCount]));

    libCom.setStateVariable(context, 'SerialNumbers', {
        actual: actualNumbers,
        initial: serialNumbers.initial,
    });

    sectionedTable
        .getSection(
            `${IsAndroid(context)
                ? 'SerialNumbersObjectTableAndroid'
                : 'SerialNumbersObjectTable'
            }`,
        )
        .redraw();
}
