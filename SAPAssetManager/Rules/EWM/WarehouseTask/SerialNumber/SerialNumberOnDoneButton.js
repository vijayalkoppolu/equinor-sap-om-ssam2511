/**
* Close the modal and save the serial numbers
* @param {IClientAPI} context
*/
export default function SaveSerialNumbers(context) {
    return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
}
