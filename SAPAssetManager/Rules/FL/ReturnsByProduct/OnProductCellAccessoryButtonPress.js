

import CommonLibrary from '../../Common/Library/CommonLibrary';
import { ProductReturnStatus } from '../Common/FLLibrary';

export default function OnProductCellAccessoryButtonPress(clientAPI) {

    const statusAtRemote = ProductReturnStatus.AtRemote;
    const statusReadyForDispatch = ProductReturnStatus.ReadyForDispatch;
    const statusReturnDraft = ProductReturnStatus.ReturnDraft;
    const statusReturnRequested = ProductReturnStatus.ReturnRequested;
    const statusReturnScheduled = ProductReturnStatus.ReturnScheduled;

    if (clientAPI.binding.FldLogsReturnStatus === statusAtRemote ||
        clientAPI.binding.FldLogsReturnStatus === statusReturnDraft ||
        clientAPI.binding.FldLogsReturnStatus === statusReturnRequested) {
        return CommonLibrary.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPInitiateReturnNav.action', clientAPI.binding['@odata.readLink'], '$expand=FldLogsRecommendedAction_Nav, FldLogsReturnStatus_Nav, FldLogsSupproc_Nav, FldLogsRefDocType_Nav, FldLogsShippingPoint_Nav');
    } else if (clientAPI.binding.FldLogsReturnStatus === statusReturnScheduled ||
        clientAPI.binding.FldLogsReturnStatus === statusReadyForDispatch ) {
        return CommonLibrary.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPUpdatePickQuantityNav.action', clientAPI.binding['@odata.readLink'], '$expand=FldLogsRecommendedAction_Nav, FldLogsReturnStatus_Nav, FldLogsSupproc_Nav, FldLogsRefDocType_Nav, FldLogsShippingPoint_Nav');
    } else
        return CommonLibrary.navigateOnRead(clientAPI, '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPUpdatePickQuantityNav.action', clientAPI.binding['@odata.readLink'], '$expand=FldLogsRecommendedAction_Nav, FldLogsReturnStatus_Nav, FldLogsSupproc_Nav, FldLogsRefDocType_Nav, FldLogsShippingPoint_Nav');

}

