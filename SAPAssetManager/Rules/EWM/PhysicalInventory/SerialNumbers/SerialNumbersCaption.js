import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Returns the caption for the serial numbers list based on the number of selected serial numbers.
 */

export default function SerialNumbersCaption(context) {
    const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;

    if (!serialNumbers || !serialNumbers.length) {
        return context.localizeText('serial_numbers');
    } else {
        const confirmed = serialNumbers.filter(item => item.Selected).length;
        const total = serialNumbers.length;

        return context.localizeText('serial_numbers_x_x', [confirmed, total]);
    }
}
