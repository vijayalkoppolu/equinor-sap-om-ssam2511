import ConfirmationCreateIsEnabledForWO from '../Confirmations/CreateUpdate/ConfirmationCreateIsEnabledForWO';
import IsAddConfirmationButtonVisibleOnOperationDetails from '../QAB/IsAddConfirmationButtonVisibleOnOperationDetails';

/**
 * Determine if confirmations are enabled for the current object
 * Used for enabling confirmation scenario feature buttons/action bar items
 * @param {*} context 
 * @returns 
 */
export default async function ConfirmationIsEnabledForThisObject(context) {
    switch (context.binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
            return ConfirmationCreateIsEnabledForWO(context);
        case '#sap_mobile.MyWorkOrderOperation':
            return IsAddConfirmationButtonVisibleOnOperationDetails(context);
        case '#sap_mobile.MyWorkOrderSubOperation':
            return IsAddConfirmationButtonVisibleOnOperationDetails(context);
        default: //Confirmation or other scenario, so no restrictions
            return true;
    }
}
