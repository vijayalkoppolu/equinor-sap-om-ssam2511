import libConfirm from './ConfirmationScenariosLibrary';

/**
 * Close the Generate QR Code page, so terminate the countdown timer if it is running
 * @param {*} context 
 */
export default function CloseGenerateQRCodePage(context) {
    libConfirm.terminateCountDownIfRunning(context);
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
