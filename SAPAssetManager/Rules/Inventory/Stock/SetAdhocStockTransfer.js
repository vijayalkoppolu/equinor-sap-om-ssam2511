import setAdhocGoodsTemplate from './SetAdhocGoodsTemplate';
import libCom from '../../Common/Library/CommonLibrary';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function SetAdhocStockTransfer(context) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(context, 'CREATE');
    TelemetryLibrary.logUserEvent(context,
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/StockTransfer.global').getValue(),
        TelemetryLibrary.EVENT_TYPE_COMPLETE);
    return setAdhocGoodsTemplate(context, 'T');
}
