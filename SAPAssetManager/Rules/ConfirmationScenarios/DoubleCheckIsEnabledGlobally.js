
import ConfirmationScenariosFeatureIsEnabledWrapper from './ConfirmationScenariosFeatureIsEnabledWrapper';
import libConfirm from './ConfirmationScenariosLibrary';

/**
 * Is the Confirmation Scenarios feature enabled and is the user authorized to create confirmations?
 * Is the double-check (verification) scenario globally activated?
 * @param {} context 
 * @returns 
 */
export default function DoubleCheckIsEnabledGlobally(context) {
    return ConfirmationScenariosFeatureIsEnabledWrapper(context) && libConfirm.getDoubleCheckGlobalAuthorization(context);
}
