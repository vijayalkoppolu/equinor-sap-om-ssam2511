import libCom from '../../../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../../../SideDrawer/EnableMultipleTechnician';
import SetStockTransfer from './SetStockTransfer';
import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function TransferFromDetails(clientAPI) {
    let flag = EnableMultipleTechnician(clientAPI) ? 'UPDATE' : 'CREATE';
    libCom.setOnCreateUpdateFlag(clientAPI, flag);
    TelemetryLibrary.logUserEvent(clientAPI,
        clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/StockTransfer.global').getValue(),
        TelemetryLibrary.EVENT_TYPE_COMPLETE);
    return SetStockTransfer(clientAPI);
}
