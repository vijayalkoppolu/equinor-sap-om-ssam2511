import { IsBulkConfirmationSignatureFlowActive, StoreBulkConfirmationSignature } from '../../WorkOrders/Operations/BulkConfirmationLibrary';
import WorkOrderOperationsConfirmation from '../../WorkOrders/Operations/WorkOrderOperationsConfirmation';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function SignatureControlCreateSignature(context) {
    if (IsBulkConfirmationSignatureFlowActive(context)) {
        return StoreBulkConfirmationSignature(context).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return WorkOrderOperationsConfirmation(context);
            });
        });
    }

    return TelemetryLibrary.executeActionWithLogUserEvent(context,
        '/SAPAssetManager/Actions/SignatureControl/Create/SignatureControlCreateSignature.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/SignatureCapture.global').getValue(),
        TelemetryLibrary.EVENT_TYPE_CREATE);
}
