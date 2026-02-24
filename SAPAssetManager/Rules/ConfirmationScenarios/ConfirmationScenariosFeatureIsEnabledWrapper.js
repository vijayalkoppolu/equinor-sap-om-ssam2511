import ConfirmationScenariosFeatureIsEnabled from './ConfirmationScenariosFeatureIsEnabled';
import ConfirmationCreateIsEnabled from '../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';

/**
 * Is the Confirmation Scenarios feature enabled and is the user authorized to create confirmations?
 * @param {} context 
 * @returns 
 */
export default function ConfirmationScenariosFeatureIsEnabledWrapper(context) {
    return ConfirmationScenariosFeatureIsEnabled(context) && ConfirmationCreateIsEnabled(context);
}
