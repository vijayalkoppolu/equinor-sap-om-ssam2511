import libCom from '../Common/Library/CommonLibrary';

/**
 * Scan QRCode, validate and navigate to confirmation screen if passed, otherwise display error toast
 * @param {*} context 
 */
export default function DoubleCheckConfirmationNavWrapper(context) {
    const scenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();

    libCom.setStateVariable(context, 'ConfirmationScenario', scenario);
    return context.executeAction('/SAPAssetManager/Actions/ConfirmationScenarios/ConfirmationScenarioQRCodeScan.action');
}
