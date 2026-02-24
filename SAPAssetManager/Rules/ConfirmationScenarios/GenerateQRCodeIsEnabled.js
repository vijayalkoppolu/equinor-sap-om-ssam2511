import ConfirmationScenariosFeatureIsEnabled from './ConfirmationScenariosFeatureIsEnabled';
import libConfirm from './ConfirmationScenariosLibrary';

/**
 * Does the user have authorization to generate a QR Code?
 * @param {*} context 
 * @returns 
 */
export default function GenerateQRCodeIsEnabled(context) {
    if (ConfirmationScenariosFeatureIsEnabled(context) && libConfirm.getUserAuthorizedScenarios(context).length > 0) {
        return true; //User has at least one authorized scenario
    }

    return false; //Feature is not enabled or user has no authorized scenarios
}
