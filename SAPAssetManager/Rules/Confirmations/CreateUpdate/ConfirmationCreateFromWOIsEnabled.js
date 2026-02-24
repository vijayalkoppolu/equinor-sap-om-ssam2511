import ConfirmationCreateIsEnabled from './ConfirmationCreateIsEnabled';
import ConfirmationCreateIsEnabledForWO from './ConfirmationCreateIsEnabledForWO';

/**
* Check if confirmation is enabled and can be created for WO
* @param {IClientAPI} context
*/
export default function ConfirmationCreateFromWOIsEnabled(context) {
    return ConfirmationCreateIsEnabled(context) && ConfirmationCreateIsEnabledForWO(context);
}
