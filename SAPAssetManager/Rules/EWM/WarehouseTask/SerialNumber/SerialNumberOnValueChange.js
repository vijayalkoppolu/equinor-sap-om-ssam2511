/**
* This function enables/disables the Add serial number button whenever the serial number is entered
* @param {IClientAPI} context
*/
import libVal from '../../../Common/Library/ValidationLibrary';
export default function SerialNumberOnValueChange(context) {
    const value = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum').getValue().trim();
    const serialButton = context.getPageProxy().getControl('SectionedTable').getControl('SerialButton');
    serialButton.setEnabled(libVal.evalIsNotEmpty(value));
}
