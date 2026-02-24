import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import IsS4ServiceConfirmationEnabled from '../../ServiceConfirmations/IsS4ServiceConfirmationEnabled';
import S4ServiceAuthorizationLibrary from '../../UserAuthorizations/S4ServiceAuthorizationLibrary';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import IsServiceOrderReleased from './IsServiceOrderReleased';

export default function ShowAddConfirmationDialog(context) {
    const updateResult = MobileStatusUpdateResultsClass.getInstance().getActionResult(SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE);
    if (IsS4ServiceConfirmationEnabled(context) && S4ServiceAuthorizationLibrary.isServiceConfirmationCreateEnabled(context)) {
        return IsServiceOrderReleased(context, updateResult).then(isReleased => {
            if (isReleased) {
                return libMobile.showWarningMessage(context, context.localizeText('confirmations_add_item_message')).then(confirmed => {
                    return saveFlagToActionResults(confirmed);
                });
            }

            return saveFlagToActionResults(false);
        });
    }

    return saveFlagToActionResults(false);
}

function saveFlagToActionResults(value) {
    MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.ADD_CONFIRMATION_ITEM_DIALOG, value);
    return Promise.resolve();
}
