import libConfirm from './ConfirmationScenariosLibrary';
import libCom from '../Common/Library/CommonLibrary';

/**
 * QR Code was scanned successfully
 * Process the data and navigate to confirmation screen if validation succeeds
 * @param {*} context 
 * @returns 
 */
export default async function ConfirmationScenarioQRCodeScanSuccess(context) {
    const actionResult = context.getActionResult('BarcodeScanner');
    let errorAction = '/SAPAssetManager/Actions/ConfirmationScenarios/QRCodeInvalidMessage.action';
    const pageName = libCom.getPageName(context);

    libCom.removeStateVariable(context, 'ConfirmationScenarioErrorAction');
    if (!actionResult) {
        return '';
    }
    const processedObject = await libConfirm.processQRCode(context, actionResult.data); //Decrypt the scanned QR Code

    if (processedObject) { //Valid Confirmation Scenario QR Code
        let isValid = await libConfirm.validateQRCode(context, processedObject); //Does this QR Code pass user and time validation?
        if (isValid) {
            await libConfirm.processRecordCreation(context, processedObject); //Handle local or online QRCode storage and log records
            return await libConfirm.processConfirmation(context, processedObject); //Create a new confirmation or update current confirmation
        }
    }

    //Invalid QR Code, so display error prompt
    if (pageName === 'ConfirmationsCreateUpdatePage') { //Failed scan was initiated from the confirmation screen, so reset the segment control
        const formCellContainerProxy = context.getControl('FormCellContainer');
        let segmentControl = formCellContainerProxy.getControl('ScenarioSeg');
        segmentControl.setValue('None');
    }
    let overrideErrorAction = libCom.getStateVariable(context, 'ConfirmationScenarioErrorAction');

    if (overrideErrorAction) {
        errorAction = overrideErrorAction;
        if (errorAction === 'UNKNOWN_ERROR') { //Display a toast message for unknown errors
            context.getClientData().Error = context.localizeText('online_service_unknown_error');
            await context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
            errorAction = '';
        }
    }

    if (errorAction) return context.executeAction(errorAction);
    return '';
}
