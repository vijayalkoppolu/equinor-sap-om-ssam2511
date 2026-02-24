import libCom from '../../Common/Library/CommonLibrary';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

/**
* Start download of an online entity (equipment/floc)
* Show error toast message, if download is already in progress
* @param {IClientAPI} context
*/
export default function DownloadToDevice(context) {
    if (!libCom.getStateVariable(context, 'OnlineSearchDownloadInProgress')) {
        disableActionsOnDownload(context);
        libCom.setStateVariable(context, 'OnlineSearchDownloadInProgress', true);

        TelemetryLibrary.logUserEvent(context,
            context.getGlobalDefinition('/SAPAssetManager/Globals/Features/OnlineSearch.global').getValue(),
            TelemetryLibrary.EVENT_TYPE_DOWNLOAD);

        // on WO tab and WO/Op/SubOp details should assign business object and then download
        if (isAssignActionRequired(context, context.getPageProxy().getActionBinding()?.['@odata.type'])) {
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/AssignAndDownloadInProgress.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadInProgress.action');
        }
    }

    return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadInProgressErrorDialog.action');
}

function disableActionsOnDownload(context) {
    if (libCom.getPageName(context).includes('Details')) {
        context.getPageProxy().setActionBarItemVisible('Assign', false);
    } else {
        const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
        onlineSearchPage.setActionBarItemVisible('SearchCriteria', false);
    }
}

function isAssignActionRequired(context, odataType) {
    const assignRequiredODataTypes = [
        libCom.getGlobalDefinition(context, 'ODataTypes/OnlineWorkOrder.global'),
        libCom.getGlobalDefinition(context, 'ODataTypes/OnlineWorkOrderOperation.global'),
        libCom.getGlobalDefinition(context, 'ODataTypes/OnlineWorkOrderSubOperation.global'),
    ];

    return assignRequiredODataTypes.includes(odataType);
}
