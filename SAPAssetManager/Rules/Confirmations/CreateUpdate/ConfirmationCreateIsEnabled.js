import authorizedConfirmationCreate from '../../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import ConfirmationsIsEnabled from '../ConfirmationsIsEnabled';

/**
* Check if feature is enabled and user is authorized to create confirmations
* @param {IClientAPI} context
*/
export default function ConfirmationCreateIsEnabled(context) {
    return ConfirmationsIsEnabled(context) && authorizedConfirmationCreate(context);
}
