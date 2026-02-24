import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import ConfirmationCreateFromOperation from '../../Confirmations/CreateUpdate/ConfirmationCreateFromOperation';
import ConfirmationCreateFromWONav from '../../Confirmations/CreateUpdate/ConfirmationCreateFromWONav';
import libCom from '../../Common/Library/CommonLibrary';

export default function ObjectCardTimeCreate(context) {
    if (IsOperationLevelAssigmentType(context)) {
        if (ConfirmationsIsEnabled(context)) {
            return ConfirmationCreateFromOperation(context);
        } else {
            libCom.setOnCreateUpdateFlag(context, 'CREATE');
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action');
        }
    } else {
        if (ConfirmationsIsEnabled(context)) {
            return ConfirmationCreateFromWONav(context);
        } else {
            libCom.setOnCreateUpdateFlag(context, 'CREATE');
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateForWONav.action');
        }
    }

}
