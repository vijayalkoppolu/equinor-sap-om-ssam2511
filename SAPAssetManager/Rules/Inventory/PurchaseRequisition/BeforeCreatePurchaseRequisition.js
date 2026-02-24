import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import AfterCreatePurchaseRequisition from './AfterCreatePurchaseRequisition';

export default function BeforeCreatePurchaseRequisition(context) {
    if (PurchaseRequisitionLibrary.mandatoryFieldsValid(context) && PurchaseRequisitionLibrary.fieldsLengthValid(context)) {
        if (CommonLibrary.IsOnCreate(context)) {
            if (PurchaseRequisitionLibrary.isAddAnother(context) || PurchaseRequisitionLibrary.isCreateFromDetailsPage(context)) {
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreatePurchaseRequisitionItem.action').then(() => {
                    return AfterCreatePurchaseRequisition(context);
                });
            }
            return TelemetryLibrary.executeActionWithLogUserEvent(context,
                '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreatePurchaseRequisitionChangeSet.action',
                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PurchaseRequisition.global').getValue(),
                TelemetryLibrary.EVENT_TYPE_CREATE);
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/UpdatePurchaseRequisitionItem.action');
        }
    }

    return Promise.reject();
}
