import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libMeter from '../../../Meter/Common/MeterLibrary';

export default async function MeterRegisterReadingsButtonVisible(context) {
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const previousContextBinding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;

    let readLink = '';
    if (previousContextBinding['@odata.type'] === '#sap_mobile.DisconnectionObject') { // Disconnect/Reconnect
        readLink = previousContextBinding['@odata.readLink'] + '/DisconnectActivity_Nav/WOHeader_Nav';
    } else if (previousContextBinding['@odata.type'] === '#sap_mobile.OrderISULink') { // Install/Remove/Replace/Aperiodic
        readLink = previousContextBinding['@odata.readLink'] + '/Workorder_Nav';
    } else if (previousContextBinding['@odata.type'] === '#sap_mobile.StreetRoute') { // Periodic
        return true;
    } else {
        return false;
    }

    const woHeader = await context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=OrderISULinks,OrderMobileStatus_Nav').then(result => result.length ? result.getItem(0) : null);
    if (woHeader) {
        let meterTransactionType = woHeader.OrderISULinks?.[0].ISUProcess;
        let mobileStatus = woHeader.OrderMobileStatus_Nav.MobileStatus;
        if (mobileStatus === STARTED) {
            return meterTransactionType === 'READING' || meterTransactionType === 'REPAIR' || libMeter.isLocal(previousContextBinding) || libMeter.isProcessed(previousContextBinding);
        }
    }

    return false;
}
